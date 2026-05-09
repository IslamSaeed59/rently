import sys
import json
import re
import cv2
import warnings

warnings.filterwarnings("ignore")

try:
    import easyocr
except ImportError:
    print(json.dumps({"error": "EasyOCR is not installed. Run: pip install easyocr opencv-python"}))
    sys.exit(1)

def arabic_to_english_digits(text):
    arabic_digits = "٠١٢٣٤٥٦٧٨٩"
    english_digits = "0123456789"
    translation_table = str.maketrans(arabic_digits, english_digits)
    return text.translate(translation_table)

def process_image(image_path):
    try:
        reader = easyocr.Reader(['ar', 'en'], gpu=False, verbose=False)
        img = cv2.imread(image_path)
        if img is None:
            return {"error": f"Could not read image at {image_path}"}

        # detail=1 gives bounding boxes
        results = reader.readtext(img, detail=1)
        
        # Sort bounding boxes: Top to Bottom, then Right to Left
        # y_min is approx results[i][0][0][1]
        # x_max is approx results[i][0][1][0] (top-right x)
        
        # Group by lines (very rough heuristic: if y differs by less than 20 pixels, they are on same line)
        lines = []
        for bbox, text, prob in results:
            y_center = (bbox[0][1] + bbox[2][1]) / 2
            x_center = (bbox[0][0] + bbox[1][0]) / 2
            lines.append({'text': text, 'y': y_center, 'x': x_center})
            
        # Sort by Y first
        lines.sort(key=lambda item: item['y'])
        
        # We don't strictly need perfect lines if we just want keywords and ID, 
        # but for ID we just concatenate all digits found.
        # Actually, if we just extract all Arabic digits from the RAW results before reordering:
        
        full_text = " ".join([item['text'] for item in lines])
        normalized_text = arabic_to_english_digits(full_text)
        
        # 1. Extract 14-digit ID
        # Since EasyOCR chunks the ID number, let's find the line with the most digits.
        # Often the ID number is on its own line at the bottom.
        # Let's cluster by Y
        y_clusters = []
        for item in lines:
            placed = False
            for cluster in y_clusters:
                if abs(cluster['y'] - item['y']) < 30: # 30 pixels tolerance for same line
                    cluster['items'].append(item)
                    placed = True
                    break
            if not placed:
                y_clusters.append({'y': item['y'], 'items': [item]})
                
        id_number = None
        for cluster in y_clusters:
            # Sort items left to right for numbers!
            cluster['items'].sort(key=lambda i: i['x'], reverse=False)
            line_text = " ".join([i['text'] for i in cluster['items']])
            line_norm = arabic_to_english_digits(line_text)
            
            # Remove spaces to see if we get a 14 digit sequence
            digits_only = re.sub(r'\D', '', line_norm)
            match = re.search(r'([23]\d{13})', digits_only)
            if match:
                id_number = match.group(1)
                break

        # 2. Keywords (Check independently because EasyOCR might scramble word order)
        # We use tolerant matching because OCR often misreads Arabic on noisy ID backgrounds
        has_id_word = bool(re.search(r'بطاق[ةه]', normalized_text))
        has_personal_word = bool(re.search(r'[شس]خصي[ةه]', normalized_text))
        has_national_word = bool(re.search(r'قومي', normalized_text))
        
        # Consider it valid if it has ANY of the main ID keywords OR if it successfully extracted a 14-digit ID
        has_keywords = has_id_word or has_personal_word or has_national_word or (id_number is not None)

        return {
            "success": True,
            "has_keywords": has_keywords,
            "id_number": id_number,
            "extracted_text": full_text
        }

    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No image path provided."}))
        sys.exit(1)
        
    image_path = sys.argv[1]
    result = process_image(image_path)
    
    sys.stdout.reconfigure(encoding='utf-8')
    print(json.dumps(result, ensure_ascii=False))
