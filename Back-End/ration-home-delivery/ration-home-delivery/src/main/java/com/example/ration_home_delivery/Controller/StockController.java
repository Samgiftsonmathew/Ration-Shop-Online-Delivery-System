package com.example.ration_home_delivery.Controller;

import com.example.ration_home_delivery.Dto.StockDto;
import com.example.ration_home_delivery.Dto.StockRequestDto;
import com.example.ration_home_delivery.Entity.Stock;
import com.example.ration_home_delivery.Service.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.ration_home_delivery.Repository.StockRepository;

import java.util.List;

@RestController
@RequestMapping("/stocks")
@CrossOrigin(origins ="http://localhost:4200")
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;

    @GetMapping("/allstocks")
    public List<Stock> getAllStocks() {
        return stockService.getAllStocks();
    }


    @PostMapping
    public ResponseEntity<Stock> createOrUpdateStock(@RequestBody StockRequestDto request) {
        Stock stock = stockService.createOrUpdateStock(request);
        return ResponseEntity.ok(stock);
    }

    @PostMapping("/bulk")
    public ResponseEntity<String> bulkUploadStocks(@RequestBody List<StockDto> stocks) {
        stockService.bulkSaveStocks(stocks);
        return ResponseEntity.ok("Stocks uploaded successfully");
    }

    @GetMapping("/bysubadmin/{subAdminId}")
    public ResponseEntity<List<Stock>> getStocksBySubAdmin(@PathVariable Long subAdminId) {
        return ResponseEntity.ok(stockService.getStocksBySubAdmin(subAdminId));
    }

    @GetMapping("/byregion/{regionId}")
    public ResponseEntity<List<Stock>> getStocksByRegion(@PathVariable int regionId) {
        return ResponseEntity.ok(stockService.getStocksByRegion(regionId));
    }
}

