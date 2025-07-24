from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

#Certificate from Aiven
SSL_ROOT_CERT = "C:/Users/marci/PycharmProjects/organizer/ca.pem"

#User info
DB_USER = "avnadmin"
DB_PASSWORD = "paste_password"
DB_HOST = "pg-36cffcfc-appsdb.e.aivencloud.com"
DB_PORT = "22275"
DB_NAME = "defaultdb"

DATABASE_URL = (
    f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    f"?sslmode=verify-full&sslrootcert={SSL_ROOT_CERT}"
)

#Connection engine and session
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

#Models base
Base = declarative_base()
