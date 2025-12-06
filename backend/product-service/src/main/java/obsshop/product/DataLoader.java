package com.obsshop.product;

import com.obsshop.product.model.Product;
import com.obsshop.product.repo.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {
  private final ProductRepository repo;
  public DataLoader(ProductRepository repo){ this.repo=repo; }

  @Override
  public void run(String... args) throws Exception {
    // Do not auto-seed here to avoid double-seeding; seeder container will insert.
  }
}
