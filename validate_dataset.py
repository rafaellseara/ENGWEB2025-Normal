#!/usr/bin/env python3
# validate_dataset.py

import json
import sys
from collections import Counter

def validate_dataset(file_path):
    issues_found = False

    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # 1) Verificar IDs duplicados
    ids = [doc.get('_id') for doc in data]
    duplicated = [x for x, count in Counter(ids).items() if count > 1]
    if duplicated:
        print(f"❌ Duplicate _id values found: {duplicated}")
        issues_found = True

    # 2) Checar estrutura de cada documento
    for doc in data:
        doc_issues = []
        doc_id = doc.get('_id', '<sem _id>')

        # Campos obrigatórios no topo
        for field in ['_id', 'anoEdicao', 'musicas', 'organizacao']:
            if field not in doc:
                doc_issues.append(f"Missing top-level field '{field}'")

        # 'musicas' deve ser um array
        if 'musicas' in doc and not isinstance(doc['musicas'], list):
            doc_issues.append("'musicas' is not a list")

        # Validar cada música (compositor agora opcional)
        if isinstance(doc.get('musicas'), list):
            for idx, song in enumerate(doc['musicas'], start=1):
                # Campos críticos
                for required in ['id', 'link', 'título', 'país', 'intérprete']:
                    if required not in song:
                        doc_issues.append(f"Song #{idx} missing '{required}'")
                # Compositor → warning
                if 'compositor' not in song:
                    print(f"⚠️ Edition {doc_id}, song #{idx} ('{song.get('id')}') missing 'compositor'.")

        # Aviso sobre 'vencedor' (campo opcional)
        if 'vencedor' not in doc:
            print(f"⚠️ Edition {doc_id} has no 'vencedor' field (optional).")

        # Reportar erros deste documento
        if doc_issues:
            print(f"❌ Issues in document with _id={doc_id}:")
            for issue in doc_issues:
                print(f"   - {issue}")
            issues_found = True

    # 3) Consistência nos nomes de país
    all_countries = {
        song.get('país')
        for doc in data
        for song in doc.get('musicas', [])
        if song.get('país') is not None
    }
    underscored = [c for c in all_countries if '_' in c]
    if underscored:
        print(f"⚠️ Country names containing underscores: {underscored}")

    if not issues_found:
        print("✅ No structural issues found. Dataset looks valid for import.")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python3 validate_dataset.py <dataset_file.json>")
        sys.exit(1)
    validate_dataset(sys.argv[1])
