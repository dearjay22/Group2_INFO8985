package com.obsshop.product.controller;

import com.obsshop.product.model.Product;
import com.obsshop.product.repo.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {
  private final ProductRepository repo;
  public ProductController(ProductRepository repo){ this.repo=repo; }

  @GetMapping
  public List<Product> all(){ return repo.findAll(); }

  @PostMapping
  public Product create(@RequestBody Product p){ return repo.save(p); }

  @PostMapping("/bulk")
  public ResponseEntity<List<Product>> bulk(@RequestBody List<Product> products){
    return ResponseEntity.ok(repo.saveAll(products));
  }
}
