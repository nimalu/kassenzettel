import csv
import random

def generate_receipt(itemsList):
    item_length = int(max(1, random.normalvariate(12, 10)))
    items_base = random.choices(itemsList, k=item_length)
    taxClasses = random.choice([["A", "B"], ["E", "F"]])

    items = []
    for (name, price) in items_base:
        price = random.normalvariate(price, price*0.5)
        taxClass = random.choice(taxClasses)
        items.append({
            "name": name,
            "price": round(price, 2),
            "taxClass": taxClass
        })
    return {
        "items": items
    }

def read_items_ds(f):
    reader = csv.reader(f)
    next(reader)
    return [(row[0], float(row[1])) for row in reader]

def generate_receipts(length):
    with open("./data/items.csv", "r") as file:
        itemsList = read_items_ds(file)

    return [generate_receipt(itemsList) for _ in range(length)]