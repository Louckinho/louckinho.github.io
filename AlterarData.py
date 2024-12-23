import os
import ctypes
from datetime import datetime

# Caminho do diretório
directory = r'D:\\'

# Nova data (substitua pela desejada)
new_date = datetime(2024, 9, 10, 11, 33, 21)
new_time = new_date.strftime('%d-%m-%Y %H:%M:%S')

# Função para alterar a data de criação
def set_creation_time(file_path, new_date):
    handle = ctypes.windll.kernel32.CreateFileW(
        file_path, 256, 0, None, 3, 128, None
    )
    if handle == -1:
        print(f"Erro ao abrir o arquivo: {file_path}")
        return False

    # Converter para formato FILETIME
    timestamp = int(new_date.timestamp() * 10000000) + 116444736000000000
    ctime = ctypes.c_longlong(timestamp)

    ctypes.windll.kernel32.SetFileTime(handle, ctypes.byref(ctime), None, None)
    ctypes.windll.kernel32.CloseHandle(handle)
    return True

# Alterar datas dos arquivos
for root, dirs, files in os.walk(directory):
    for file in files:
        file_path = os.path.join(root, file)
        if set_creation_time(file_path, new_date):
            print(f"Data de criação alterada: {file_path}")
        else:
            print(f"Falha ao alterar: {file_path}")
