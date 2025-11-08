import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv
import json

load_dotenv()

def initialize_firebase():
    try:
        if not firebase_admin._apps:
  
            if os.getenv('FIREBASE_SERVICE_ACCOUNT'):
                service_account_info = json.loads(os.getenv('FIREBASE_SERVICE_ACCOUNT'))
                cred = credentials.Certificate(service_account_info)

            elif os.path.exists("serviceAccountKey.json"):
                cred = credentials.Certificate("serviceAccountKey.json")

            else:
                raise FileNotFoundError(
                    "❌ Service account key not found. Place 'serviceAccountKey.json' in backend folder."
                )

            firebase_admin.initialize_app(cred)

        db = firestore.client()
        print("✅ Firebase initialized successfully.")
        return db

    except Exception as e:
        print(f"Error initializing Firebase: {e}")
        return None

db = initialize_firebase()

def get_db():
    """Return Firestore database instance"""
    return db

def add_document(collection_name, document_id, data):
    """Add or update a document in Firestore"""
    try:
        db.collection(collection_name).document(document_id).set(data)
        return {"success": True, "message": "Document added successfully"}
    except Exception as e:
        return {"success": False, "message": str(e)}


def get_document(collection_name, document_id):
    """Get a document from Firestore"""
    try:
        doc = db.collection(collection_name).document(document_id).get()
        if doc.exists:
            return {"success": True, "data": doc.to_dict()}
        return {"success": False, "message": "Document not found"}
    except Exception as e:
        return {"success": False, "message": str(e)}


def get_all_documents(collection_name):
    """Get all documents from a collection"""
    try:
        docs = db.collection(collection_name).stream()
        data = []
        for doc in docs:
            d = doc.to_dict()
            d["id"] = doc.id
            data.append(d)
        return {"success": True, "data": data}
    except Exception as e:
        return {"success": False, "message": str(e)}


def delete_document(collection_name, document_id):
    """Delete a document from Firestore"""
    try:
        db.collection(collection_name).document(document_id).delete()
        return {"success": True, "message": "Document deleted successfully"}
    except Exception as e:
        return {"success": False, "message": str(e)}


def update_document(collection_name, document_id, data):
    """Update a document in Firestore"""
    try:
        db.collection(collection_name).document(document_id).update(data)
        return {"success": True, "message": "Document updated successfully"}
    except Exception as e:
        return {"success": False, "message": str(e)}
