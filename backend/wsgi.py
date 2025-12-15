from main import app
from a2wsgi import ASGIMiddleware

# PythonAnywhere uses WSGI. We wrap our ASGI (FastAPI) app.
application = ASGIMiddleware(app)
