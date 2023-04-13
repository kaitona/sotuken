# ベースとなるイメージを指定する
FROM python:3.9

# 作業ディレクトリを設定する
WORKDIR /app

# 必要なファイルをコピーする
COPY requirements.txt .

# ファイルをインストールする
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションのコードをコピーする
COPY . .

# ポートを公開する
EXPOSE 8000

# サーバーを起動する
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]