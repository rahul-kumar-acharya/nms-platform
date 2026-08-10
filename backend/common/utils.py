import random
import string
import uuid

def generate_epin_code(prefix="EPIN"):
    """
    Generates a cryptographically secure 16-character alphanumeric code:
    EPIN-XXXX-YYYY-ZZZZ
    """
    chars = string.ascii_uppercase + string.digits
    parts = [''.join(random.choices(chars, k=4)) for _ in range(3)]
    return f"{prefix}-" + "-".join(parts)

def generate_member_id(sequence_num):
    """
    Formats sequence number into standard member ID: M00001, M00002...
    """
    return f"M{sequence_num:05d}"
