interface Guest {
  id: number;
  firstName: string;
  lastName: string;
  type: 'Adult' | 'Child';
  country: string;
  rsvp: boolean;
  attending: boolean;
}

interface GuestGroup {
  id: number;
  groupName: string;
  wishes?: string;
  guests: Guest[];
}

export const createRSVPEmailTemplate = (
  guestGroup: GuestGroup,
  updatedGuests: Guest[]
): string => {
  const attendingGuests = updatedGuests.filter((guest) => guest.attending);
  const notAttendingGuests = updatedGuests.filter((guest) => !guest.attending);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New RSVP Submission</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Cormorant:wght@400;600&family=Montserrat:wght@300;400;500&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; font-family: 'Montserrat', sans-serif; background-color: #F4F6F3;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F4F6F3; padding: 40px 20px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(107, 128, 104, 0.1); overflow: hidden;">
          
          <!-- Header with forest green background -->
          <tr>
            <td style="background: linear-gradient(135deg, #6B8068 0%, #8FA48C 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; font-family: 'Playfair Display', serif; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: 1px;">
                New RSVP Received
              </h1>
              <div style="width: 60px; height: 2px; background-color: rgba(255, 255, 255, 0.5); margin: 20px auto 0;"></div>
            </td>
          </tr>
          
          <!-- Content Section -->
          <tr>
            <td style="padding: 40px 30px;">
              
              <!-- Group Name -->
              <div style="margin-bottom: 30px; padding: 20px; background-color: #E8EDE7; border-radius: 8px; border-left: 4px solid #6B8068;">
                <h2 style="margin: 0 0 8px 0; font-family: 'Cormorant', serif; color: #4A5947; font-size: 24px; font-weight: 600;">
                  Party
                </h2>
                <p style="margin: 0; font-size: 18px; color: #2C2C2C; font-weight: 500;">
                  ${guestGroup.groupName}
                </p>
              </div>

              ${
                attendingGuests.length > 0
                  ? `
              <!-- Attending Guests -->
              <div style="margin-bottom: 30px;">
                <h3 style="margin: 0 0 15px 0; font-family: 'Cormorant', serif; color: #6B8068; font-size: 22px; font-weight: 600; border-bottom: 2px solid #E8EDE7; padding-bottom: 10px;">
                  ✓ Attending (${attendingGuests.length})
                </h3>
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${attendingGuests
                    .map(
                      (guest, index) => `
                  <tr>
                    <td style="padding: 12px 15px; ${
                      index % 2 === 0 ? 'background-color: #F4F6F3;' : ''
                    } border-radius: 6px;">
                      <div style="display: flex; align-items: center;">
                        <span style="display: inline-block; width: 8px; height: 8px; background-color: #6B8068; border-radius: 50%; margin-right: 12px;"></span>
                        <div>
                          <div style="font-size: 16px; color: #2C2C2C; font-weight: 500;">
                            ${guest.firstName} ${guest.lastName}
                          </div>
                          <div style="font-size: 13px; color: #7A8F77; margin-top: 2px;">
                            ${guest.type} • ${guest.country}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  `
                    )
                    .join('')}
                </table>
              </div>
              `
                  : ''
              }

              ${
                notAttendingGuests.length > 0
                  ? `
              <!-- Not Attending Guests -->
              <div style="margin-bottom: 30px;">
                <h3 style="margin: 0 0 15px 0; font-family: 'Cormorant', serif; color: #8FA48C; font-size: 22px; font-weight: 600; border-bottom: 2px solid #E8EDE7; padding-bottom: 10px;">
                  ✗ Not Attending (${notAttendingGuests.length})
                </h3>
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${notAttendingGuests
                    .map(
                      (guest, index) => `
                  <tr>
                    <td style="padding: 12px 15px; ${
                      index % 2 === 0 ? 'background-color: #F4F6F3;' : ''
                    } border-radius: 6px;">
                      <div style="display: flex; align-items: center;">
                        <span style="display: inline-block; width: 8px; height: 8px; background-color: #9BAA97; border-radius: 50%; margin-right: 12px;"></span>
                        <div>
                          <div style="font-size: 16px; color: #2C2C2C; font-weight: 500;">
                            ${guest.firstName} ${guest.lastName}
                          </div>
                          <div style="font-size: 13px; color: #7A8F77; margin-top: 2px;">
                            ${guest.type} • ${guest.country}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  `
                    )
                    .join('')}
                </table>
              </div>
              `
                  : ''
              }

              ${
                guestGroup.wishes
                  ? `
              <!-- Wishes Section -->
              <div style="margin-bottom: 20px; padding: 20px; background: linear-gradient(135deg, #E8EDE7 0%, #F4F6F3 100%); border-radius: 8px; border: 1px solid #E8EDE7;">
                <h3 style="margin: 0 0 12px 0; font-family: 'Cormorant', serif; color: #4A5947; font-size: 20px; font-weight: 600;">
                  💌 Special Wishes
                </h3>
                <p style="margin: 0; font-size: 15px; color: #556B52; line-height: 1.6; font-style: italic;">
                  "${guestGroup.wishes}"
                </p>
              </div>
              `
                  : ''
              }

              <!-- Summary Stats -->
              <div style="margin-top: 30px; padding: 20px; background-color: #F4F6F3; border-radius: 8px; border-top: 3px solid #6B8068;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 8px; text-align: center; border-right: 1px solid #E8EDE7;">
                      <div style="font-size: 28px; font-weight: 600; color: #6B8068; font-family: 'Playfair Display', serif;">
                        ${updatedGuests.length}
                      </div>
                      <div style="font-size: 12px; color: #7A8F77; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px;">
                        Total Guests
                      </div>
                    </td>
                    <td style="padding: 8px; text-align: center; border-right: 1px solid #E8EDE7;">
                      <div style="font-size: 28px; font-weight: 600; color: #6B8068; font-family: 'Playfair Display', serif;">
                        ${attendingGuests.length}
                      </div>
                      <div style="font-size: 12px; color: #7A8F77; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px;">
                        Attending
                      </div>
                    </td>
                    <td style="padding: 8px; text-align: center;">
                      <div style="font-size: 28px; font-weight: 600; color: #9BAA97; font-family: 'Playfair Display', serif;">
                        ${notAttendingGuests.length}
                      </div>
                      <div style="font-size: 12px; color: #7A8F77; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px;">
                        Not Attending
                      </div>
                    </td>
                  </tr>
                </table>
              </div>

            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #4A5947; padding: 25px 30px; text-align: center;">
              <p style="margin: 0; font-size: 13px; color: #E8EDE7; line-height: 1.6;">
                This is an automated notification from your wedding RSVP system.<br>
                Received on ${new Date().toLocaleString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};
