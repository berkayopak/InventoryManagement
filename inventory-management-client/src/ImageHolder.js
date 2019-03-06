import { Upload, Icon, message } from 'antd';
import React, {Component} from 'react';

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload(file) {
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
        message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJPG && isLt2M;
}

function action(file) {

}

export default class Avatar extends React.Component {
    state = {
        loading: false,
        selectedFile: null,
        itemId: this.props.itemId,
        imageLink: this.props.imageLink,

    };

    handleChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            info.file.status = 'done';
            return;
        }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, imageLink => this.setState({
                imageLink,
                loading: false,
            }));
        }
    }

    render() {
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        var imageLink = this.state.imageLink;
        var itemId = this.state.itemId;
        return (
            <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action={"http://localhost:4000/products/upload?itemId="+itemId}
                beforeUpload={beforeUpload}
                onChange={this.handleChange}
                type={"file"}
            >
                {imageLink ? <img src={imageLink} alt="avatar" /> : uploadButton}
            </Upload>
        );
    }
}
