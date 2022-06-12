import React, { MouseEvent, ChangeEvent, PureComponent } from 'react';
import { Button, LegacyForms } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { ActivityLogOptions, ActivityLogSecureOptions } from '../types';

const { SecretFormField, FormField } = LegacyForms;

const defaultSiteUrl = 'https://activity.bricks.tools';

interface Props extends DataSourcePluginOptionsEditorProps<ActivityLogOptions> {}

interface State {}

export class ConfigEditor extends PureComponent<Props, State> {
  loginWindow?: Window | null;

  onValueChange = (key: string) => (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    const jsonData = {
      ...options.jsonData,
      [key]: event.target.value,
    };
    onOptionsChange({ ...options, jsonData });
  };

  // Secure field (only sent to the backend)
  onAPIKeyChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    onOptionsChange({
      ...options,
      secureJsonData: {
        authToken: event.target.value,
      },
    });
  };

  onResetAPIKey = () => {
    const { onOptionsChange, options } = this.props;
    onOptionsChange({
      ...options,
      secureJsonFields: {
        ...options.secureJsonFields,
        authToken: false,
      },
      secureJsonData: {
        ...options.secureJsonData,
        authToken: '',
      },
    });
  };

  doLogin = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    this.onResetAPIKey();
    let {
      jsonData: { site },
    } = this.props.options;
    if (!site) {
      site = defaultSiteUrl;
      const { onOptionsChange, options } = this.props;
      const jsonData = {
        ...options.jsonData,
        site,
      };
      onOptionsChange({ ...options, jsonData });
    }
    this.loginWindow = window.open(`${site}/auth/login`, 'auth', 'width=400, height=500');
  };

  componentWillUnmount() {
    if (this.loginWindow) {
      this.loginWindow.close();
    }
  }

  render() {
    const { options } = this.props;
    const { jsonData, secureJsonFields } = options;
    const secureJsonData = (options.secureJsonData || {}) as ActivityLogSecureOptions;

    return (
      <div className="gf-form-group">
        <div className="gf-form">
          <FormField
            label="Site"
            labelWidth={12}
            inputWidth={24}
            onChange={this.onValueChange('site')}
            value={jsonData.site || defaultSiteUrl}
            placeholder="BRICKS Site"
          />
        </div>

        <div className="gf-form">
          <FormField
            label="Workspace ID"
            labelWidth={12}
            inputWidth={24}
            onChange={this.onValueChange('workspaceId')}
            value={jsonData.workspaceId || ''}
            placeholder="BRICKS Workspace ID"
          />
        </div>

        <div className="gf-form-inline">
          <div className="gf-form">
            <SecretFormField
              isConfigured={(secureJsonFields && secureJsonFields.authToken) as boolean}
              value={secureJsonData.authToken || ''}
              label="Auth Token"
              placeholder="secure json field (backend only)"
              labelWidth={5}
              inputWidth={20}
              onReset={this.onResetAPIKey}
              onChange={this.onAPIKeyChange}
            />
          </div>
          &nbsp;
          <div className="gf-form">
            <Button icon="lock" onClick={this.doLogin}>
              Get Auth Token
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
