#!/usr/bin/env python3
"""
Script to download guest list CSV from the Strapi backend API.
"""

import os
import requests
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file in the same directory
script_dir = Path(__file__).parent
env_path = script_dir / '.env'
load_dotenv(dotenv_path=env_path)

# Configuration from environment variables
API_BASE_URL = os.getenv('API_BASE_URL', 'http://localhost:1337')
API_TOKEN = os.getenv('API_TOKEN')
OUTPUT_DIR = os.getenv('OUTPUT_DIR', './downloads')

def download_guest_csv():
    """
    Downloads the guest list CSV from the API endpoint.
    """
    if not API_TOKEN:
        print("Error: API_TOKEN not found in .env file")
        print(f"Please set your Strapi API token in {env_path}")
        return False
    
    # Prepare the API endpoint URL
    endpoint = f"{API_BASE_URL}/api/guests/export-csv"
    
    # Set up headers with authorization
    headers = {
        'Authorization': f'Bearer {API_TOKEN}'
    }
    
    try:
        print(f"Downloading guest list from {endpoint}...")
        
        # Make the GET request
        response = requests.get(endpoint, headers=headers, timeout=30)
        response.raise_for_status()
        
        # Create output directory if it doesn't exist
        output_path = Path(OUTPUT_DIR)
        output_path.mkdir(parents=True, exist_ok=True)
        
        # Generate filename with timestamp
        timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
        filename = f"guest-list-{timestamp}.csv"
        filepath = output_path / filename
        
        # Save the CSV content
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(response.text)
        
        print(f"✓ Successfully downloaded guest list to: {filepath}")
        print(f"  File size: {len(response.text)} bytes")
        
        # Count number of guests (subtract 1 for header row)
        guest_count = len(response.text.split('\n')) - 1
        print(f"  Total guests: {guest_count}")
        
        return True
        
    except requests.exceptions.RequestException as e:
        print(f"✗ Error downloading guest list: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"  Status code: {e.response.status_code}")
            print(f"  Response: {e.response.text[:200]}")
        return False
    except Exception as e:
        print(f"✗ Unexpected error: {e}")
        return False

def main():
    """
    Main function to execute the script.
    """
    print("=" * 60)
    print("Guest List CSV Export Script")
    print("=" * 60)
    print()
    
    success = download_guest_csv()
    
    print()
    if success:
        print("Export completed successfully!")
    else:
        print("Export failed. Please check the error messages above.")
    
    return 0 if success else 1

if __name__ == '__main__':
    exit(main())
