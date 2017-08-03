import React from 'react';
import VariableEndpoint from './variable-endpoint.jsx';
import './tree.css'

export default class Tree extends React.Component {
    renderStruct(endpoint, level) {
        return <div>
            {
                this.renderEndpoint(endpoint, (endpoint.isInner ? 'property' : 'struct-head'), level)
            }
            {
                endpoint.properties.map(property => {
                    if(property.innerType) {
                        property.innerType.root = endpoint.root || endpoint;
                        return this.renderStruct(property.innerType, level+1);
                    }
                    property.root = endpoint.root || endpoint;
                    return this.renderEndpoint(property, 'property', level+1);
                })
            }
        </div>
    }

    renderEndpoint(endpoint, kind, level) {
        const { endpoints, type, makeConnectPoint, viewId } = this.props;
        const key = `${endpoint.paramName || ''}:${endpoint.fieldName || endpoint.name}:${viewId}`;

        let endpointKind = kind;
        if(type === 'param' || type === 'return') {
            endpointKind = `function-${kind}`;
        }

        return (
            <VariableEndpoint
                key={key}
                id={key}
                type={type}
                variable={endpoint}
                endpointKind={endpointKind}
                makeConnectPoint={makeConnectPoint}
                level={level}
            />
        );
    }

    render() {
        const { endpoints } = this.props;
        return (
            <div className='transform-endpoint-tree'>
            {
                endpoints.map(endpoint => {
                    return (
                        <div className='transform-endpoint-container'>
                            {
                                endpoint.type === 'struct' ?
                                this.renderStruct(endpoint, 0) : this.renderEndpoint(endpoint, 'variable', 0)
                            }
                        </div>
                    );
                })
            }
            </div>
        );
    }
}
