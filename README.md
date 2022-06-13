# BRICKS Activity Log for Grafana

[![CI](https://github.com/mybigday/activity-log-grafana-plugin/actions/workflows/ci.yml/badge.svg)](https://github.com/mybigday/activity-log-grafana-plugin/actions/workflows/ci.yml)

Integrite BRICKS Activity Log as Grafana Data Source.

## Contributing

Follows [conventional commits](https://www.conventionalcommits.org/).

## Getting started

1. Install dependencies

    ```bash
    yarn install
    ```

2. Start development

    1. Build plugin in development mode or run in watch mode

        ```bash
        yarn dev
        ```

        or

        ```bash
        yarn watch
        ```

    2. Start local Grafana for development

        ```bash
        docker-compose up

        # URL: http://localhost:3000
        # Default user and password are admin
        ```

3. Build plugin in production mode

    ```bash
    yarn build
    ```

## Server APIs

`:spaceId` is Workspace ID.

### `GET` - `/api/v1/:spaceId/health`

- Authorization: `Bearer JWT.Token`

For test DataSource.

### `GET` - `/api/v1/:spaceId/metrics`

- Authorization: `Bearer JWT.Token`

Get available metrics.

### `POST` - `/api/v1/:spaceId/query`

- Content-Type: `application/json`
- Authorization: `Bearer JWT.Token`

```js
// Grafana `DataQueryRequest` payload
```

Do a panel query.

### `POST` - `/api/v1/:spaceId/tag-keys`

- Content-Type: `application/json`
- Authorization: `Bearer JWT.Token`

Get available adhoc filter keys.

### `POST` - `/api/v1/:spaceId/tag-values`

- Content-Type: `application/json`
- Authorization: `Bearer JWT.Token`

```json
{
    "key": "string"
}
```

Get available adhoc filter values.
