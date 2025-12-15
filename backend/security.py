import bcrypt
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import base64
import os
from dotenv import load_dotenv

load_dotenv()

SALT = os.getenv("MASTER_KEY_SALT", "default-salt-change-this").encode()

class SecurityManager:
    """Manage encryption and hashing for password manager"""
    
    @staticmethod
    def hash_master_password(password: str) -> str:
        """Hash master password menggunakan bcrypt"""
        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        return hashed.decode('utf-8')
    
    @staticmethod
    def verify_master_password(password: str, hashed: str) -> bool:
        """Verify master password"""
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    
    @staticmethod
    def derive_key_from_password(master_password: str) -> bytes:
        """Derive encryption key dari master password menggunakan PBKDF2"""
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=SALT,
            iterations=100000,
        )
        key = base64.urlsafe_b64encode(kdf.derive(master_password.encode()))
        return key
    
    @staticmethod
    def encrypt_password(plain_password: str, master_password: str) -> str:
        """Encrypt password menggunakan AES-256 (Fernet)"""
        key = SecurityManager.derive_key_from_password(master_password)
        f = Fernet(key)
        encrypted = f.encrypt(plain_password.encode())
        return encrypted.decode()
    
    @staticmethod
    def decrypt_password(encrypted_password: str, master_password: str) -> str:
        """Decrypt password"""
        try:
            key = SecurityManager.derive_key_from_password(master_password)
            f = Fernet(key)
            decrypted = f.decrypt(encrypted_password.encode())
            return decrypted.decode()
        except Exception as e:
            raise ValueError("Invalid master password or corrupted data")
    
    @staticmethod
    def generate_session_token(user_id: int) -> str:
        """Generate simple session token (untuk demo, production gunakan JWT)"""
        import secrets
        return secrets.token_urlsafe(32)
