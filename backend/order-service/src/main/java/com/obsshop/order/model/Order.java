package com.obsshop.order.model;

import jakarta.persistence.*;

@Entity
@Table(name = "orders")
public class Order {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private Long productId;
  private Integer qty;
  private String status;

  public Order(){}
  // getters/setters...
  public Long getId(){return id;}
  public void setId(Long id){this.id=id;}
  public Long getProductId(){return productId;}
  public void setProductId(Long p){this.productId=p;}
  public Integer getQty(){return qty;}
  public void setQty(Integer q){this.qty=q;}
  public String getStatus(){return status;}
  public void setStatus(String s){this.status=s;}
}
