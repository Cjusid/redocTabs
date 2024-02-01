import { observer } from 'mobx-react';
import * as React from 'react';

import { Badge, DarkRightPanel, H2, MiddlePanel, Row } from '../../common-elements';
import { ShareLink } from '../../common-elements/linkify';
import { OperationModel } from '../../services/models';
import styled from '../../styled-components';
import { CallbacksList } from '../Callbacks';
import { CallbackSamples } from '../CallbackSamples/CallbackSamples';
import { Endpoint } from '../Endpoint/Endpoint';
import { ExternalDocumentation } from '../ExternalDocumentation/ExternalDocumentation';
import { Extensions } from '../Fields/Extensions';
import { Markdown } from '../Markdown/Markdown';
import { OptionsContext } from '../OptionsProvider';
import { Parameters } from '../Parameters/Parameters';
import { RequestSamples } from '../RequestSamples/RequestSamples';
import { ResponsesList } from '../Responses/ResponsesList';
import { ResponseSamples } from '../ResponseSamples/ResponseSamples';
import { SecurityRequirements } from '../SecurityRequirement/SecurityRequirement';
import { SECTION_ATTR } from '../../services';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const Description = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.unit * 6}px;
`;

export interface OperationProps {
  operation: OperationModel;
}

export const Operation = observer(({ operation }: OperationProps): JSX.Element => {
  const { name: summary, description, deprecated, externalDocs, isWebhook, httpVerb } = operation;
  const hasDescription = !!(description || externalDocs);
  const { showWebhookVerb } = React.useContext(OptionsContext);
  return (
    <OptionsContext.Consumer>
      {options => (
        <Row {...{ [SECTION_ATTR]: operation.operationHash }} id={operation.operationHash}>
          <MiddlePanel>
            <H2>
              <ShareLink to={operation.id} />
              {summary} {deprecated && <Badge type="warning"> Deprecated </Badge>}
              {isWebhook && (
                <Badge type="primary">
                  {' '}
                  Webhook {showWebhookVerb && httpVerb && '| ' + httpVerb.toUpperCase()}
                </Badge>
              )}
            </H2>
            {options.pathInMiddlePanel && !isWebhook && (
              <Endpoint operation={operation} inverted={true} />
            )}
            {hasDescription && (
              <Description>
                {description !== undefined && <Markdown source={description} />}
                {externalDocs && <ExternalDocumentation externalDocs={externalDocs} />}
              </Description>
            )}
            <Extensions extensions={operation.extensions} />
            <SecurityRequirements securities={operation.security} />
            <Tabs>
                <TabList>
                  <Tab>Request</Tab>
                  <Tab>Response</Tab>
                  <Tab>Errors</Tab>
                  <Tab></Tab>
                  <Tab></Tab>
                </TabList>
                <TabPanel>
                  <Parameters parameters={operation.parameters} body={operation.requestBody} /> 
                </TabPanel>
                <TabPanel>
                  <ResponsesList responses={operation.responses.filter(response => response.code == "200")} />
                </TabPanel>
                <TabPanel>
                  <ResponsesList responses={operation.responses.filter(response => response.code != "200")} />
                </TabPanel>
              </Tabs>
            <CallbacksList callbacks={operation.callbacks} />
          </MiddlePanel>
          <DarkRightPanel>
            {!options.pathInMiddlePanel && !isWebhook && <Endpoint operation={operation} />}
            <CallbackSamples callbacks={operation.callbacks} />
          </DarkRightPanel>
        </Row>
      )}
    </OptionsContext.Consumer>
  );
});
