"""Open PowerPoint files with python-pptx. Supports .potx (PowerPoint templates) in addition to .pptx.

Corporate templates are often distributed as .potx files, but python-pptx rejects .potx
as "not a PowerPoint file". The internal structure is identical to .pptx, differing only
in the main Content_Type ([Content_Types].xml: template.main vs presentation.main).
This module replaces that MIME type in memory before loading. The source file on disk is never modified.
Saving the presentation will yield a standard .pptx file.
"""
import io
import zipfile
from pathlib import Path

TEMPLATE_CT = b"application/vnd.openxmlformats-officedocument.presentationml.template.main+xml"
PRESENTATION_CT = b"application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"
SUFFIXES = (".pptx", ".potx")


def is_pptx_like(path):
    return str(path).lower().endswith(SUFFIXES)


def open_presentation(path):
    from pptx import Presentation

    path = Path(path)
    with zipfile.ZipFile(path) as z:
        ct = z.read("[Content_Types].xml")
        if TEMPLATE_CT not in ct:
            return Presentation(str(path))
        buf = io.BytesIO()
        with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as out:
            for item in z.infolist():
                data = z.read(item.filename)
                if item.filename == "[Content_Types].xml":
                    data = data.replace(TEMPLATE_CT, PRESENTATION_CT)
                out.writestr(item, data)
    buf.seek(0)
    return Presentation(buf)
