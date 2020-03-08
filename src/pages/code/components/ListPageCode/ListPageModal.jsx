import React, { Component } from 'react';
import { Modal } from 'antd';
import ListPageHeader from './ListPageHeader';
import ListPageFilter from './ListPageFilter';
import styles from './index.less';


class ListPageModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '', // 页面标题
            buttons: [], // 页面操作按钮
        };
    }


    render() {
        const { visible, onCancel } = this.props;
        const { title, buttons } = this.state;
        return (
            <Modal
                visible={visible}
                title="配置"
                width="1200px"
                onCancel={() => { onCancel(); }}>
                <div className={styles.listPage}>
                    <ListPageHeader
                        title={title}
                        buttons={buttons}
                        getTitle={text => this.setState({ title: text })}
                        getButtons={list => this.setState({ buttons: list })} />
                    <ListPageFilter />
                </div>
            </Modal>
        );
    }
}

export default ListPageModal;