import csv
import io
from typing import List, Dict, Any

class ExportService:
    """
    Handles the serialization of Analytics Data into standardized download formats.
    """

    @staticmethod
    def to_csv(data: List[Dict[str, Any]], filename: str = "export.csv") -> bytes:
        """
        Converts a list of dictionaries to CSV byte format for FastApi StreamingResponse.
        """
        if not data:
            return b""

        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=data[0].keys())
        writer.writeheader()
        writer.writerows(data)

        return output.getvalue().encode('utf-8')

export_service = ExportService()
