/**
 * guest controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::guest.guest',
  ({ strapi }) => ({
    // Custom endpoint to find guest with password validation
    async findWithPassword(ctx) {
      try {
        const { firstName, lastName, password } = ctx.request.body;

        if (!firstName || !lastName || !password) {
          return ctx.badRequest(
            'Missing required fields: firstName, lastName, password'
          );
        }

        // Get the password from the password single type
        const passwordData = await strapi.entityService.findMany(
          'api::password.password',
          {
            fields: ['password'],
          }
        );

        // Validate password
        if (
          !passwordData ||
          passwordData.password.trim().toLocaleUpperCase() !==
            password.trim().toLocaleUpperCase()
        ) {
          return ctx.unauthorized('Invalid password');
        }

        // Normalize strings to remove accents and make case-insensitive
        const normalizeString = (str: string) =>
          str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();

        const normalizedFirstName = normalizeString(firstName);
        const normalizedLastName = normalizeString(lastName);

        // Get all guests and filter in-memory for accent and case insensitivity
        const allGuests = await strapi.entityService.findMany(
          'api::guest.guest',
          {
            populate: ['guest_group', 'guest_group.guests'],
          }
        );

        const guests = allGuests.filter((guest: any) => {
          const guestFirstName = normalizeString(guest.firstName || '');
          const guestLastName = normalizeString(guest.lastName || '');
          return (
            guestFirstName === normalizedFirstName &&
            guestLastName === normalizedLastName
          );
        });

        if (!guests || guests.length === 0) {
          return ctx.notFound('Guest not found');
        }

        // const groupedGuests = await strapi.entityService.findMany(
        //   'api::guest-group.guest-group',
        //   {
        //     filters: {
        //       groupName: { $eq: 'Rodríguez Schneider' },
        //     },
        //     populate: ['guests'],
        //   }
        // );

        // Return the first matching guest
        return {
          data: guests[0],
          // group: groupedGuests
        };
      } catch (err) {
        console.error('Error in findWithPassword:', err);
        return ctx.internalServerError('An error occurred');
      }
    },

    // Custom endpoint to submit RSVP responses
    async submitRSVP(ctx) {
      try {
        const { guests, guest_group_id, wishes } = ctx.request.body;

        if (!guests || !Array.isArray(guests)) {
          return ctx.badRequest('guests array is required');
        }

        // Update each guest's RSVP status
        const updatedGuests = await Promise.all(
          guests.map(async (guest: { id: number; attending: boolean }) => {
            if (!guest.id || typeof guest.attending !== 'boolean') {
              throw new Error('Each guest must have id and attending fields');
            }

            await strapi.entityService.update(
              'api::guest-group.guest-group',
              guest_group_id,
              {
                data: {
                  wishes: wishes,
                },
              }
            );

            return await strapi.entityService.update(
              'api::guest.guest',
              guest.id,
              {
                data: {
                  invitationSent: true,
                  rsvp: true,
                  attending: guest.attending,
                },
              }
            );
          })
        );

        // Get the guest group with all details for the email
        const guestGroup = await strapi.entityService.findOne(
          'api::guest-group.guest-group',
          guest_group_id,
          {
            populate: ['guests'],
          }
        );

        // Send email notification
        try {
          await strapi
            .service('api::guest.guest')
            .sendRSVPNotification(guestGroup, updatedGuests);
        } catch (emailError) {
          // Log the error but don't fail the RSVP submission
          console.error('Failed to send email notification:', emailError);
        }

        return { data: updatedGuests };
      } catch (err) {
        console.error('Error in submitRSVP:', err);
        return ctx.internalServerError('An error occurred');
      }
    },

    // Custom endpoint to export guest list as CSV
    async exportCSV(ctx) {
      try {
        // Fetch all guests with guest group information
        const guests = await strapi.entityService.findMany('api::guest.guest', {
          populate: ['guest_group'],
          pagination: { limit: -1 }, // Get all guests
        });

        // Define CSV headers matching Table.csv format
        const headers = [
          'Invitation Sent',
          'RSVP',
          'Attending',
          'Name',
          'Address',
          'Group',
          'Table',
          'Type',
          'Country',
        ];

        // Convert guests to CSV rows matching Table.csv format
        const rows = guests.map((guest: any) => {
          // Combine firstName and lastName into full name
          const fullName =
            `${guest.firstName || ''} ${guest.lastName || ''}`.trim();

          // Format boolean values as 'true' or empty string
          const formatBoolean = (value: boolean | null | undefined): string => {
            return value === true ? 'true' : 'false';
          };

          return [
            formatBoolean(guest.invitationSent), // Invitation Sent - not tracked in current schema
            formatBoolean(guest.rsvp),
            formatBoolean(guest.attending),
            fullName,
            guest.address, // Address - not tracked in current schema
            guest.guest_group?.groupName || '',
            guest.table, // Table - not tracked in current schema
            guest.type || 'Adult',
            guest.country || 'US',
          ];
        });

        // Escape CSV fields (handle commas and quotes)
        const escapeCSV = (field: any): string => {
          const value = String(field);
          if (
            value.includes(',') ||
            value.includes('"') ||
            value.includes('\n')
          ) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        };

        // Build CSV content
        const csvContent = [
          headers.map(escapeCSV).join(','),
          ...rows.map((row) => row.map(escapeCSV).join(',')),
        ].join('\n');

        // Set response headers for file download
        ctx.set('Content-Type', 'text/csv; charset=utf-8');
        ctx.set(
          'Content-Disposition',
          `attachment; filename="guest-list-${new Date().toISOString().split('T')[0]}.csv"`
        );

        return csvContent;
      } catch (err) {
        console.error('Error in exportCSV:', err);
        return ctx.internalServerError('An error occurred while exporting CSV');
      }
    },

    // Custom endpoint to import guest list from CSV
    async importCSV(ctx) {
      try {
        const files = ctx.request.files;

        if (!files || !files.file) {
          return ctx.badRequest('No CSV file uploaded');
        }

        const file: any = Array.isArray(files.file)
          ? files.file[0]
          : files.file;

        // Read CSV file - handle both filepath and path properties
        const fs = require('fs');
        const filePath = file.filepath || file.path;

        if (!filePath) {
          console.error('File object:', file);
          return ctx.badRequest(
            'Could not determine file path from uploaded file'
          );
        }

        const csvContent = fs.readFileSync(filePath, 'utf-8');

        // Parse CSV
        const lines = csvContent.split('\n').filter((line) => line.trim());
        if (lines.length < 2) {
          return ctx.badRequest('CSV file is empty or invalid');
        }

        const headers = lines[0].split(',');
        const rows = lines.slice(1);

        // Parse CSV rows with proper handling of quoted fields
        const parseCSVRow = (row: string): string[] => {
          const result: string[] = [];
          let current = '';
          let inQuotes = false;

          for (let i = 0; i < row.length; i++) {
            const char = row[i];

            if (char === '"') {
              if (inQuotes && row[i + 1] === '"') {
                current += '"';
                i++;
              } else {
                inQuotes = !inQuotes;
              }
            } else if (char === ',' && !inQuotes) {
              result.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          result.push(current.trim());
          return result;
        };

        // Delete all existing guests and guest groups
        console.log('Deleting existing guests and guest groups...');

        const existingGuests: any = await strapi.entityService.findMany(
          'api::guest.guest',
          {}
        );

        for (const guest of existingGuests) {
          await strapi.entityService.delete('api::guest.guest', guest.id);
        }

        const existingGroups: any = await strapi.entityService.findMany(
          'api::guest-group.guest-group',
          {}
        );

        for (const group of existingGroups) {
          await strapi.entityService.delete(
            'api::guest-group.guest-group',
            group.id
          );
        }

        // Reset auto-increment counters
        const db = strapi.db.connection;
        await db.raw('DELETE FROM sqlite_sequence WHERE name = ?', ['guests']);
        await db.raw('DELETE FROM sqlite_sequence WHERE name = ?', [
          'guest_groups',
        ]);

        console.log('Existing data cleared. Starting import...');

        // Map to store created groups
        const groupCache = new Map<string, number>();

        const parseBooleanValue = (value: string): boolean | null => {
          const normalized = value.toLowerCase().trim();
          if (
            normalized === 'true' ||
            normalized === '1' ||
            normalized === 'yes'
          ) {
            return true;
          }

          return false;
          // if (
          //   normalized === 'false' ||
          //   normalized === '0' ||
          //   normalized === 'no'
          // ) {
          //   return false;
          // }
          // return null;
        };

        // Process each row
        let importedCount = 0;
        let skippedCount = 0;

        for (const row of rows) {
          try {
            const fields = parseCSVRow(row);

            // Map CSV columns (based on your CSV structure)
            const invitationSentValue = fields[0] || '';
            const rsvpValue = fields[1] || '';
            const attendingValue = fields[2] || '';
            const name = fields[3] || '';
            const address = fields[4] || '';
            const groupName = fields[5] || '';
            const table = fields[6] || '';
            const type = fields[7] || 'Adult';
            const country = fields[8] || '';

            // Skip rows without a name
            if (!name || !name.trim()) {
              skippedCount++;
              continue;
            }

            // Parse name into firstName and lastName
            const nameParts = name.trim().split(' ');
            let firstName = '';
            let lastName = '';

            if (nameParts.length === 1) {
              firstName = nameParts[0];
              lastName = '';
            } else {
              firstName = nameParts[0];
              lastName = nameParts.slice(1).join(' ');
            }

            // Parse RSVP and Attending
            const rsvp = parseBooleanValue(rsvpValue);
            const attending = parseBooleanValue(attendingValue);
            const invitationSent = parseBooleanValue(invitationSentValue);

            // Handle guest group
            let groupId = null;
            if (groupName && groupName.trim()) {
              const trimmedGroupName = groupName.trim();

              if (groupCache.has(trimmedGroupName)) {
                groupId = groupCache.get(trimmedGroupName);
              } else {
                // Create new group and publish it
                const newGroup: any = await strapi.entityService.create(
                  'api::guest-group.guest-group',
                  {
                    data: {
                      groupName: trimmedGroupName,
                    },
                  }
                );

                // Publish the group
                const publishedGroup = await strapi.entityService.update(
                  'api::guest-group.guest-group',
                  newGroup.id,
                  {
                    data: {
                      publishedAt: new Date(),
                    },
                  }
                );

                groupId = publishedGroup.documentId;
                groupCache.set(trimmedGroupName, groupId);
                console.log(
                  `Created and published group: ${trimmedGroupName} (ID: ${groupId})`
                );
              }
            }

            // Create guest
            const guestData: any = {
              firstName,
              lastName,
              address,
              table,
              type: type || 'Adult',
              country: country || 'US',
            };

            if (rsvp !== null) {
              guestData.rsvp = rsvp;
            }

            if (attending !== null) {
              guestData.attending = attending;
            }

            if (invitationSent !== null) {
              guestData.invitationSent = invitationSent;
            }

            if (groupId) {
              guestData.guest_group = {
                connect: [groupId],
              };
            }

            const createdGuest = await strapi.entityService.create(
              'api::guest.guest',
              {
                data: guestData,
              }
            );

            console.log(
              `Created guest: ${firstName} ${lastName} (Group: ${groupName || 'None'})`
            );

            importedCount++;
          } catch (rowError) {
            console.error('Error processing row:', row, rowError);
            skippedCount++;
          }
        }

        console.log(
          `Import completed: ${importedCount} guests imported, ${skippedCount} rows skipped`
        );

        return {
          success: true,
          message: 'CSV imported successfully',
          stats: {
            imported: importedCount,
            skipped: skippedCount,
            groups: groupCache.size,
          },
        };
      } catch (err) {
        console.error('Error in importCSV:', err);
        return ctx.internalServerError('An error occurred while importing CSV');
      }
    },
  })
);
