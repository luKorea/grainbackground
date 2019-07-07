import React, {Component} from 'react';
import { Upload, Icon, Modal, message } from 'antd';

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

/*
* TODO 图片上传组件
* */
class PictureWall extends Component {
    state = {
        previewVisible: false, //标识是否显示大图预览界面
        previewImage: '',
        fileList: [
            // {
            //     uid: '-1', // 文件唯一ID
            //     name: 'xxx.png', // 文件名
            //     status: 'done', // 上传状态
            //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            // },
        ],
    };

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        // 显示指定file对应的大图
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    // TODO 图片上传
    handleChange = ({ file, fileList }) => {
        if (file.status === 'done') {
            const result = file.response;
            if (result.status === 0) {
                message.success('图片上传成功');
                const {name, url} = result.data;
                file = fileList[fileList.length -1];
                file.name = name;
                file.url = url;
            } else message.error('图片上传失败');
        }
        this.setState({ fileList })
    };
    // 获取所有已上传的图片数组
    getImgs = () => {
      return this.state.fileList.map(file => file.name);
    };

    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div className="clearfix">
                <Upload
                    accept='image/*' /*只接受图片格式*/
                    name='image'
                    action='/manage/img/upload'
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {/*TODO 上传图片限制*/}
                    {fileList.length >= 4 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}

export default PictureWall;
