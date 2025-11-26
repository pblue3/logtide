-- Extract container ID from Docker log filepath
-- Path format: /var/lib/docker/containers/CONTAINER_ID/CONTAINER_ID-json.log

function extract_container_id(tag, timestamp, record)
    -- Get the filepath from the record
    local filepath = record["filepath"]

    if filepath then
        -- Extract container ID from path
        -- Pattern: /var/lib/docker/containers/CONTAINER_ID/...
        local container_id = filepath:match("/var/lib/docker/containers/([^/]+)/")

        if container_id then
            -- Add container_id to the record
            record["container_id"] = container_id
            -- Add short ID (first 12 chars, like docker ps shows)
            record["container_short_id"] = container_id:sub(1, 12)
        end
    end

    -- Return modified record
    -- Return code: -1 (drop), 0 (keep), 1 (modified)
    return 1, timestamp, record
end
