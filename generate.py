import csv
import requests

def read_items_ds(f):
    reader = csv.reader(f)
    next(reader)
    return [(row[0], float(row[1])) for row in reader]

def main():
    with open("./data/items.csv", "r") as file:
        items = read_items_ds(file)
    
    url = "http://localhost:3000/api/generate"
    data = { "receipts": [{}]}
    with requests.post(url, json=data, stream=True) as r:
        r.raise_for_status()
        with open("./kassenzettel.zip", "wb") as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)

if __name__ == "__main__":
    main()