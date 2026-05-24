package com.haniu.tthieu.haniu.service;

import com.haniu.tthieu.haniu.entity.system.SystemConfig;

public interface SystemConfigService {
    SystemConfig getConfig(String key);
    SystemConfig updateConfig(String key, String value);
}
