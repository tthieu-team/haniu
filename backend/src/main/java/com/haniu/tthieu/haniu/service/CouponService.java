package com.haniu.tthieu.haniu.service;

import com.haniu.tthieu.haniu.entity.marketing.Coupon;

import java.util.List;
import java.util.UUID;

public interface CouponService {
    Coupon createCoupon(Coupon coupon);
    Coupon getCouponByCode(String code);
    List<Coupon> getAllCoupons();
    Coupon updateCoupon(UUID id, Coupon couponDetails);
    void deleteCoupon(UUID id);
}
