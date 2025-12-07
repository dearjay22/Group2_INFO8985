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
  private Integer inventory;

  public Product(){}

  // getters/setters
  public Long getId(){ return id; }
  public void setId(Long id){ this.id=id; }
  public String getName(){ return name;}
  public void setName(String n){ this.name=n;}
  public Double getPrice(){ return price;}
  public void setPrice(Double p){ this.price=p;}
  public Integer getInventory(){ return inventory;}
  public void setInventory(Integer s){ this.inventory=s;}
}
