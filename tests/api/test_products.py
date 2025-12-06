import requests

def test_product_service_alive():
    r = requests.get("http://product-service:8081/products")
    assert r.status_code == 200