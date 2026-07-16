from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


PORT = 8000


class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


if __name__ == "__main__":
    root = Path(__file__).resolve().parent
    server = ThreadingHTTPServer(("localhost", PORT), Handler)
    print(f"Serving {root}")
    print(f"Open http://localhost:{PORT}")
    print("Press Ctrl+C to stop.")
    server.serve_forever()
