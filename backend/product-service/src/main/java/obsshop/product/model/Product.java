package com.obsshop.product.model;

import jakarta.persistence.*;

@Entity
@Table(name = "product")
public class Product {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String name;
  private Double price;
  private Integer stock;

  public Product(){}

  // getters/setters
  public Long getId(){ return id; }
  public void setId(Long id){ this.id=id; }
  public String getName(){ return name;}
  public void setName(String n){ this.name=n;}
  public Double getPrice(){ return price;}
  public void setPrice(Double p){ this.price=p;}
  public Integer getStock(){ return stock;}
  public void setStock(Integer s){ this.stock=s;}
}
