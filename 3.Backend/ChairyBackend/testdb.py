#connection test

from sqlalchemy import create_engine, text

SSL_ROOT_CERT = r"C:\Users\marci\PycharmProjects\organizer\ca.pem"
DB_USER = "avnadmin"
DB_PASSWORD = "paste_password"
DB_HOST = "pg-36cffcfc-appsdb.e.aivencloud.com"
DB_PORT = "22275"
DB_NAME = "defaultdb"

DATABASE_URL = (
    f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    f"?sslmode=verify-full&sslrootcert={SSL_ROOT_CERT}"
)

engine = create_engine(DATABASE_URL)

with engine.connect() as conn:
    result = conn.execute(text("SELECT 1"))
    print(result.fetchone())
