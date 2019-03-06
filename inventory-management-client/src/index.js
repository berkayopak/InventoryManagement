import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import "antd/dist/antd.css";
import {
    Table, Input, Button, Popconfirm, Form, Divider, notification, InputNumber
} from 'antd';

import ImageHolder from './ImageHolder';

import axios from 'axios';

const FormItem = Form.Item;
const EditableContext = React.createContext();
const baseURL = "http://localhost:4000/products";

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);
export const Image = ImageHolder;


class EditableCell extends React.Component {
    state = {
        editing: false,
    }

    toggleEdit = () => {
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
            if (editing) {
                this.input.focus();
            }
        });
    }

    save = () => {
        const { record, handleSave } = this.props;
        this.form.validateFields((error, values) => {
            if (error) {
                return;
            }
            this.toggleEdit();
            handleSave({ ...record, ...values });
        });
    }

    render() {
        const { editing } = this.state;
        const {
            editable,
            dataIndex,
            title,
            record,
            index,
            handleSave,
            ...restProps
        } = this.props;
        return (
            <td ref={node => (this.cell = node)} {...restProps}>
                {editable ? (
                    <EditableContext.Consumer>
                        {(form) => {
                            this.form = form;
                            return (
                                editing ? (
                                    <FormItem style={{ margin: 0 }}>
                                        {form.getFieldDecorator(dataIndex, {
                                            rules: [{
                                                required: true,
                                                message: `${title} is required.`,
                                            }],
                                            initialValue: record[dataIndex],
                                        })(
                                            <Input
                                                ref={node => (this.input = node)}
                                                onPressEnter={this.save}
                                                onBlur={this.save}
                                            />
                                        )}
                                    </FormItem>
                                ) : (
                                    <div
                                        className="editable-cell-value-wrap"
                                        style={{ paddingRight: 24 }}
                                        onClick={this.toggleEdit}
                                    >
                                        {restProps.children}
                                    </div>
                                )
                            );
                        }}
                    </EditableContext.Consumer>
                ) : restProps.children}
            </td>
        );
    }
}

class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [{
            title: 'name',
            dataIndex: 'name',
            width: '30%',
            editable: true,
        }, {
            title: 'price',
            dataIndex: 'price',
            render: (text, record) => (
                this.state.dataSource.length >= 1
                    ? (
                        <div>
                        <InputNumber
                            defaultValue={record.price}
                            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            onChange={value => record.price = value}
                        />
                        </div>
                    ) : null
            ),
        }, {
            title: 'description',
            dataIndex: 'description',
            editable: true,
        }, {
            title: 'image',
            dataIndex: 'image',
            render: (text, record) => (

                this.state.dataSource.length >= 1
                    ? (
                        <div>
                            <ImageHolder loading={props.loading} imageLink={record.imageLink} itemId={record.id} />
                        </div>
                    ) : null

            ),
        }, {
            title: 'operation',
            dataIndex: 'operation',
            render: (text, record) => (

                this.state.dataSource.length >= 1
                    ? (
                        <span>
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.id)}>
                            <a href="javascript:;">Delete</a>
                        </Popconfirm>
                        <Divider type="vertical" />
                        <Popconfirm title="Sure to update?" onConfirm={() => this.handleUpdate(record)}>
                            <a href="javascript:;">Update</a>
                        </Popconfirm>
                        </span>
                    ) : null

            ),

        }];

        this.state = {
            dataSource: null,
            count: null,
        };
    }

    handleDelete = (id) => {
        const dataSource = [...this.state.dataSource];
        this.setState({ dataSource: dataSource.filter(item => item.id !== id) });
        axios.post(baseURL+"/delete?id="+id);
    }

    handleUpdate = (record) => {
        const updateData = {
            name: record.name,
            price: record.price,
            description: record.description,
        }
        axios.post(baseURL+"/update?id="+record.id, updateData)
            .then(function (response) {
                notification.success({message: "Successfully updated!"})
            })
            .catch(function (error) {
                notification.error({message:"Update failed!", description: error.toString()})
            })

    }

    handleAdd = () => {
        const { count, dataSource } = this.state;
        const newData = {
            name: `New Product`,
            price: 0,
            description: `New Product Description`
        };

        axios.post(baseURL+"/create", newData)
            .then((response) => {
                this.setState({
                    dataSource: [...dataSource, response.data],
                    count: count + 1,
                });
                notification.success({message: "New product added!"});

            })
            .catch(function (error) {
                notification.error({message:"Error adding new product!", description: error.toString()})
            })
    }

    handleSave = (row) => {
        const newData = [...this.state.dataSource];
        const index = newData.findIndex(item => row.id === item.id);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        this.setState({ dataSource: newData });
    }

    componentDidMount() {
        axios.get(baseURL+"/get")
            .then(res => {
                const products = res.data;
                this.setState({
                    dataSource: products,
                    count: products.length,
                });
            })
    }

    render() {
        const { dataSource } = this.state;
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
        const columns = this.columns.map((col) => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                }),
            };
        });
        return (
            <div>
                <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
                    Add a product
                </Button>
                <Table
                    components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                    rowKey="id"
                />
            </div>
        );
    }
}


ReactDOM.render(<EditableTable />, document.getElementById('container'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

