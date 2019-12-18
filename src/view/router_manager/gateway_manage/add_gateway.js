import {
  Form, Row, Col, Input, Button, Icon, Modal, Select, InputNumber
} from 'antd';
import React from 'react'
import { eventBus } from './events';
const { Option } = Select;
const { TextArea } = Input;

const renderInput = (props) => (item, name, disabled = false) => {
  const { getFieldDecorator } = props.form;
  return (
    <Row style={{ marginBottom: 20 }}>
      <Form.Item label={name} hasFeedback >
        {getFieldDecorator(item, {
          rules: [{
            required: true,message:"网关编码为必填且要唯一"
          }],
          initialValue: props[item],
        })(
          <Input disabled={disabled} />
        )}
      </Form.Item>
    </Row>
  );
}

class __AddGatewayForm extends React.Component {

  checkMessge = (rule, value, callback) => {
    const form = this.props.form;
    if (!value && form.getFieldValue('content_type')) {
      callback('响应类型选择后，此项必填');
    } else {
      callback();
    }
  }

  handleChange = () => this.setState({}, () => this.props.form.validateFields(['message'], { force: true }))


  render() {
    const { props } = this;
    const { getFieldDecorator } = props.form;
    return (
      <Form
        className="ant-advanced-search-form"
        style={{ width: "100%" }}
      >
        {renderInput(props)("gateway_code", "网关编码：", false)}
        <Row style={{ marginBottom: 20 }}>
          <Form.Item
            label="网关描述："
            hasFeedback
          >
            {getFieldDecorator('gateway_desc', {
              rules: [{
                required: true,message:"请填写网关描述"
              }],
              initialValue: props["gateway_desc"],
            })(
              <Input style={{ width: 200 }} />
            )}
          </Form.Item>
        </Row>
        <Row style={{ marginBottom: 20 }}>
          <Form.Item
            label="QPS限流阈值(单机)："
            hasFeedback
          >
            {getFieldDecorator('limit_count', {
              rules: [{
                required: true,message:"请设置QPS限流阈值(单机)"
              }],
              initialValue: props["limit_count"],
            })(
              <InputNumber min={0} style={{ width: 200 }} />
            )}
          </Form.Item>
        </Row>
        <Row style={{ marginBottom: 20 }}>
          <Form.Item
            label="异常响应码："
            hasFeedback
          >
            {getFieldDecorator('http_status', {
              initialValue: props["http_status"],
            })(
              <InputNumber min={100} max={600} />
            )}
          </Form.Item>
        </Row>

        <Row style={{ marginBottom: 20 }}>
          <Form.Item
            label="异常响应类型："
            hasFeedback
          >
            {getFieldDecorator('content_type', {
              initialValue: props["content_type"] ? props["content_type"] : undefined,
            })(
              <Select placeholder="请选择响应类型" style={{ width: 200 }} allowClear onChange={this.handleChange}>
                <Option value="application/json">application/json</Option>
                <Option value="application/xml">application/xml</Option>
                <Option value="text/html">text/html</Option>
                <Option value="text/plain">text/plain</Option>
              </Select>
            )}
          </Form.Item>
        </Row>
        <Row style={{ marginBottom: 20 }}>
          <Form.Item
            label="异常响应内容："
            hasFeedback
          >
            {getFieldDecorator('message', {
              initialValue: props["message"],
              rules: [{
                validator: this.checkMessge,
              }],

            })(
              <TextArea rows={4} style={{ width: 300 }} />
            )}
          </Form.Item>
        </Row>

      </Form>
    );

  }
}

const AddGatewayForm = Form.create({ name: 'gateway_add_form' })(__AddGatewayForm);

// 限流设置弹框
export class AddGateway extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      visible: false
    }
  }


  show = () => {
    this.setState({
      visible: true,
    });
  }

  hide = () => {
    this.setState({
      visible: false,
    });
  }

  submit = () => {

    this.refs.info.validateFields((err, values) => {
      if (!err) {

        eventBus.emit("add", values, this.hide)
      }
    });

  }

  render() {
    return (
      <div>
        <div className='btn_box'>
          <Button className="editable-add-btn" onClick={this.show} icon='plus' type='primary' className='right_btn'>新增网关</Button>
        </div>
        {
          this.state.visible ? <Modal
            maskClosable={false}
            title="新增网关"
            visible={this.state.visible}
            onOk={this.submit}
            onCancel={this.hide}
            okText="确认"
            cancelText="取消"
          >
            <AddGatewayForm ref="info" />
          </Modal> : ""
        }

      </div>
    );
  }
}
