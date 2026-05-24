package com.haniu.tthieu.haniu.service.impl;

import com.haniu.tthieu.haniu.entity.system.SystemConfig;
import com.haniu.tthieu.haniu.repository.SystemConfigRepository;
import com.haniu.tthieu.haniu.service.SystemConfigService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class SystemConfigServiceImpl implements SystemConfigService {

    private final SystemConfigRepository systemConfigRepository;

    @Override
    @Transactional(readOnly = true)
    public SystemConfig getConfig(String key) {
        log.info("Fetching system config for key: {}", key);
        return systemConfigRepository.findByConfigKey(key)
                .orElse(null);
    }

    @Override
    public SystemConfig updateConfig(String key, String value) {
        log.info("Updating system config for key: {}", key);
        SystemConfig config = systemConfigRepository.findByConfigKey(key)
                .orElse(SystemConfig.builder().configKey(key).build());
        config.setConfigValue(value);
        return systemConfigRepository.save(config);
    }
}
