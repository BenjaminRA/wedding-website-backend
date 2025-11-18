#!/usr/bin/env python3
"""
Script to upload and import guest list CSV to the Strapi backend API.
"""

import os
import requests
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file in the same directory
script_dir = Path(__file__).parent
env_path = script_dir / '.env'
load_dotenv(dotenv_path=env_path)

# Configuration from environment variables
API_BASE_URL = os.getenv('API_BASE_URL', 'http://localhost:1337')
API_TOKEN = os.getenv('API_TOKEN')

def upload_guest_csv(csv_file_path: str):
    """
    Uploads the guest list CSV to the API endpoint for importing.
    
    Args:
        csv_file_path: Path to the CSV file to upload
    """
    if not API_TOKEN:
        print("Error: API_TOKEN not found in .env file")
        print(f"Please set your Strapi API token in {env_path}")
        return False
    
    csv_path = Path(csv_file_path)
    if not csv_path.exists():
        print(f"Error: CSV file not found at {csv_file_path}")
        return False
    
    # Prepare the API endpoint URL
    endpoint = f"{API_BASE_URL}/api/guests/import-csv"
    
    # Set up headers with authorization
    headers = {
        'Authorization': f'Bearer {API_TOKEN}'
    }
    
    try:
        print(f"Uploading CSV file: {csv_path.name}")
        print(f"To endpoint: {endpoint}")
        print()
        
        # Open and upload the file
        with open(csv_path, 'rb') as f:
            files = {'file': (csv_path.name, f, 'text/csv')}
            
            print("Uploading... This may take a moment.")
            response = requests.post(endpoint, headers=headers, files=files, timeout=120)
            response.raise_for_status()
        
        result = response.json()
        
        print()
        print("=" * 60)
        print("✓ Import Successful!")
        print("=" * 60)
        
        if 'stats' in result:
            stats = result['stats']
            print(f"Guests imported: {stats.get('imported', 0)}")
            print(f"Rows skipped:    {stats.get('skipped', 0)}")
            print(f"Groups created:  {stats.get('groups', 0)}")
        
        if 'message' in result:
            print(f"\nMessage: {result['message']}")
        
        return True
        
    except requests.exceptions.RequestException as e:
        print()
        print("=" * 60)
        print("✗ Import Failed")
        print("=" * 60)
        print(f"Error: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Status code: {e.response.status_code}")
            try:
                error_data = e.response.json()
                print(f"Error details: {error_data}")
            except:
                print(f"Response: {e.response.text[:500]}")
        return False
    except Exception as e:
        print(f"✗ Unexpected error: {e}")
        return False

def main():
    """
    Main function to execute the script.
    """
    import sys
    
    print("=" * 60)
    print("Guest List CSV Import Script")
    print("=" * 60)
    print()
    
    # Check if CSV file path is provided as argument
    if len(sys.argv) > 1:
        csv_file = sys.argv[1]
    else:
        # Default to Table.csv in the same directory
        csv_file = script_dir / 'Table.csv'
    
    print(f"CSV file: {csv_file}")
    print()
    print("⚠️  WARNING: This will delete all existing guests and guest groups!")
    print()
    
    # Ask for confirmation
    confirmation = input("Do you want to continue? (yes/no): ").strip().lower()
    
    if confirmation not in ['yes', 'y']:
        print("Import cancelled.")
        return 1
    
    print()
    success = upload_guest_csv(str(csv_file))
    
    print()
    if success:
        print("Import completed successfully!")
    else:
        print("Import failed. Please check the error messages above.")
    
    return 0 if success else 1

if __name__ == '__main__':
    exit(main())
