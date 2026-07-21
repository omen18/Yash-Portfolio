#!/usr/bin/env python3
import urllib.request
import re
import sys
import json

def extract_form_details(url):
    print(f"Fetching Google Form from: {url}\n")
    
    # Standardize URL to viewform
    if "/viewform" not in url and "/formResponse" not in url:
        # Check if it has a form ID
        match = re.search(r'/d/e/([a-zA-Z0-9-_]+)', url)
        if match:
            url = f"https://docs.google.com/forms/d/e/{match.group(1)}/viewform"
        else:
            print("Error: Could not parse Google Form URL. Make sure it contains '/d/e/...'")
            return None
            
    # Modify URL to viewform for scanning
    url = re.sub(r'/formResponse.*', '/viewform', url)
    if "/viewform" not in url:
        url = url.rstrip('/') + '/viewform'

    try:
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'}
        )
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
    except Exception as e:
        print(f"Error fetching the page: {e}")
        return None

    # Find the FB_PUBLIC_LOAD_DATA variable
    data_match = re.search(r'FB_PUBLIC_LOAD_DATA\s*=\s*(.*?);', html, re.DOTALL)
    if not data_match:
        print("Error: Could not find form data. Make sure the form is public.")
        return None

    try:
        # Parse public load data
        data_str = data_match.group(1).strip()
        data = json.loads(data_str)
    except Exception as e:
        print(f"Error parsing form data structure: {e}")
        return None

    # Form metadata
    form_id_match = re.search(r'/d/e/([a-zA-Z0-9-_]+)', url)
    form_id = form_id_match.group(1) if form_id_match else "YOUR_FORM_ID"
    action_url = f"https://docs.google.com/forms/d/e/{form_id}/formResponse"

    # Extract questions and their corresponding entry IDs
    questions = {}
    try:
        items = data[1][1]
        for item in items:
            title = item[1]
            if len(item) > 4 and item[4] is not None:
                entry_list = item[4][0]
                entry_id = entry_list[0]
                questions[title.lower().strip()] = f"entry.{entry_id}"
    except Exception as e:
        print("Warning: JSON structure parsing failed, using regex fallback scanner...")
        matches = re.findall(r'\[(\d+),"?([^"\],]+)"?,', html)
        for m in matches:
            questions[m[1].lower().strip()] = f"entry.{m[0]}"

    print("Found fields:")
    for q, eid in questions.items():
        print(f" - {q}: {eid}")
    print()

    # Match questions with form fields
    field_mapping = {
        "email": None,
        "name": None,
        "subject": None,
        "message": None
    }

    # Best-effort matching
    for key in field_mapping.keys():
        for q_title, entry_id in questions.items():
            if key in q_title:
                field_mapping[key] = entry_id
                break

    # Prompt for missing fields if not found automatically
    for key, val in field_mapping.items():
        if not val:
            print(f"Could not automatically match field for '{key.capitalize()}'.")
            available = list(questions.keys())
            if available:
                print("Available questions found in form:")
                for idx, q in enumerate(available):
                    print(f"  {idx + 1}. {q} ({questions[q]})")
                choice = input(f"Select the number corresponding to '{key}' (or press Enter to skip): ").strip()
                if choice.isdigit() and 1 <= int(choice) <= len(available):
                    field_mapping[key] = questions[available[int(choice) - 1]]
                else:
                    field_mapping[key] = "entry.XXXXXXXXX"
            else:
                field_mapping[key] = "entry.XXXXXXXXX"

    # Generate configuration code block
    config_code = f"""
// 1. Set this to true to enable Google Form submission
const USE_GOOGLE_FORM = true;

// 2. Paste this configuration block in HaveQuestion.tsx (lines 19-27)
const GOOGLE_FORM_ACTION = "{action_url}";

const FIELD_EMAIL = "{field_mapping['email']}";
const FIELD_NAME = "{field_mapping['name']}";
const FIELD_SUBJECT = "{field_mapping['subject']}";
const FIELD_MESSAGE = "{field_mapping['message']}";
"""
    return config_code

def main():
    if len(sys.argv) > 1:
        url = sys.argv[1]
    else:
        print("=== Google Form Setup Assistant ===")
        url = input("Paste your Google Form shareable link (viewform): ").strip()
        if not url:
            print("Error: No URL provided.")
            return

    config = extract_form_details(url)
    if config:
        print("="*60)
        print("SUCCESS! Copy and paste the following block into HaveQuestion.tsx:")
        print("="*60)
        print(config)
        print("="*60)

if __name__ == "__main__":
    main()
