from flask import Flask, request, jsonify
from flask_cors import CORS
import socket
import threading
app = Flask(__name__)
CORS(app)
def scan_port(target, port, result):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    socket.setdefaulttimeout(3)
    try:
        if s.connect_ex((target, port)) == 0:
            result.append(port)
    except Exception:
        pass
    finally:
        s.close()

def scan_ports(target):
    open_ports = []
    threads = []
    for port in range(1, 1025):
        t = threading.Thread(target=scan_port, args=(target, port, open_ports))
        threads.append(t)
        t.start()
    for t in threads:
        t.join()
    return open_ports

@app.route('/scan', methods=['POST'])
def scan():
    data = request.json
    target = data.get('target')
    if not target:
        return jsonify({"error": "Target IP is required"}), 400
    try:
        target_ip = socket.gethostbyname(target)
        open_ports = scan_ports(target_ip)
        if open_ports:
            return jsonify({"open_ports": open_ports, "target_ip": target_ip})
        else:
            return jsonify({"message": "No open ports found.", "target_ip": target_ip})
    except socket.gaierror:
        return jsonify({"error": "Hostname could not be resolved."}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
