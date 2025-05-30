import json
import os
from collections import OrderedDict

def transform_for_mongo(input_path, output_path):
    # 1) Carregar o JSON original
    with open(input_path, 'r', encoding='utf-8') as f:
        raw = json.load(f)

    transformed = []
    for key, edition in raw.items():
        # 2) Extrair ano (ex: "ed1956" -> 1956)
        try:
            year = int(key.replace('ed', ''))
        except ValueError:
            # fallback para o campo 'anoEdição'
            year = int(edition.get('anoEdição', edition.get('anoEdicao')))

        # 3) Construir novo documento com _id numérico em primeiro lugar
        doc = OrderedDict()
        doc['_id'] = year
        for k, v in edition.items():
            if k == 'id':
                continue
            # opcional: normalizar nome de campo
            nk = 'anoEdicao' if k == 'anoEdição' else k
            doc[nk] = v

        transformed.append(doc)

    # 4) Gravar JSON transformado
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(transformed, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    import sys
    if len(sys.argv) != 3:
        print("Uso: python3 transform.py dataset.json dataset_transformed.json")
        sys.exit(1)

    inp, outp = sys.argv[1], sys.argv[2]
    if not os.path.isfile(inp):
        print(f"Ficheiro de input '{inp}' não existe.")
        sys.exit(1)

    transform_for_mongo(inp, outp)
    print(f"Transformação concluída. Ficheiro pronto para import: {outp}")
