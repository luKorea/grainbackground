import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import PropTypes from 'prop-types';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';



class RichTextEditor extends Component {

    constructor(props) {
        super(props);
        const html = this.props.detail;
        if (html) {
            const contentBlock = htmlToDraft(html);
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const editorState = EditorState.createWithContent(contentState);
                this.state = {
                    editorState
                };
            }
        } else {
            this.state = {
                editorState: EditorState.createEmpty()
            }
        }
    }
    static propTypes = {
        detail: PropTypes.string
    };

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    // 将数据传递给父组件
    getDetail = () => {
        // 返回输入数据对应的html格式的文本
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    };


    // 编辑器中上传图片
     uploadImageCallBack = (file) => {
        return new Promise(
            (resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', '/manage/img/upload');
                const data = new FormData();
                data.append('image', file);
                xhr.send(data);
                xhr.addEventListener('load', () => {
                    const response = JSON.parse(xhr.responseText);
                    const url = response.data.url; // 得到图片地址
                    resolve({data: {link: url}});
                });
                xhr.addEventListener('error', () => {
                    const error = JSON.parse(xhr.responseText);
                    reject(error);
                });
            }
        );
    };

    render() {
        const { editorState } = this.state;
        return (
                    <Editor
                        editorStyle={{border: '1px solid #000', minHeight: 300, paddingLeft: 10}}
                        editorState={editorState}
                        onEditorStateChange={this.onEditorStateChange}
                        toolbar={{
                            image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } }
                        }}
                    />
        );
    }
}
export default RichTextEditor;
