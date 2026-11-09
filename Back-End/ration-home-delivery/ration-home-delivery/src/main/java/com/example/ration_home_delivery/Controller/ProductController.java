package com.example.ration_home_delivery.Controller;

import com.example.ration_home_delivery.Dto.ProductWithAllocationsDTO;
import com.example.ration_home_delivery.Entity.Product;
import com.example.ration_home_delivery.Service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/products")
@CrossOrigin(origins ="http://localhost:4200")

public class ProductController {
     @Autowired
    private ProductService productService;

    @PostMapping("/add")
    public ResponseEntity<String> addProductWithAllocations(@RequestBody ProductWithAllocationsDTO dto) {
        productService.saveProductWithAllocations(dto);
        return ResponseEntity.ok("Products added successfully for each card type");
    }
    @PutMapping("/update")
    public String updateProductWithAllocations(@RequestBody ProductWithAllocationsDTO dto) {
        productService.updateProductWithAllocations(dto);
        return "Product updated successfully!";
    }

    @GetMapping("/products/by-region/{regionId}")
    public List<ProductWithAllocationsDTO> getByRegion(@PathVariable Long regionId) {
        return productService.getAllProductsWithMergedAllocationsByRegion(regionId);
    }

    @DeleteMapping("/delete-by-name-region")
    public ResponseEntity<String> deleteByNameAndRegion(@RequestParam String name, @RequestParam int regionId) {
        boolean deleted = productService.deleteProductsByNameAndRegionId(name, regionId);
        return deleted
                ? ResponseEntity.ok().build()
                : ResponseEntity.status(404).build();
    }

    @GetMapping("/allproducts")
    public List<Product> getAllProducts() {
        return productService.getAll();


    }


}
