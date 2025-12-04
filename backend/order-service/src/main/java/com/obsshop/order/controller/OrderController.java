package com.obsshop.order.controller;

import com.obsshop.order.model.Order;
import com.obsshop.order.repo.OrderRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderRepository repo;

    public OrderController(OrderRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Order> all() {
        return repo.findAll();
    }

    @PostMapping
    public Order create(@RequestBody Order o) {
        o.setStatus("CREATED");
        return repo.save(o);
    }

    @GetMapping("/heavy-report")
    public List<Order> heavy() throws InterruptedException {
        // intentional slow operation for demo/tracing
        Thread.sleep(3000);
        return repo.findAll();
    }
}
