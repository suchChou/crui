import React from 'react';
import { Button, Switch } from 'antd';
import cloneDeep from 'lodash/cloneDeep';
import { IMaterial } from '@/types/making';
import materialComponents from '@/components/materials';
import MaterialBlock from '../MaterialBlock';
import styles from './index.less';

export interface IProps {
    materialList: IMaterial[];
    setMaterialList: (materials: IMaterial[]) => void;
    setMaterial: (material: IMaterial, id: number) => void;
    clear: () => void;
}

export interface IState {
    visual: boolean;
}

class MaterialContent extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            visual: true,
        };
    }

    getMaterilTree(list: IMaterial[]) {
        const result: IMaterial[] = [];
        const data = cloneDeep(list);
        const hash: {
          [props: number]: IMaterial
        } = {};
        data.forEach((_, index) => {
            hash[data[index].id] = data[index];
        });
        data.forEach((item) => {
            const hashVP = hash[(item.pid as number)];
            if (hashVP) {
                if (hashVP.children) {
                    hashVP.children.push(item);
                } else {
                    hashVP.children = [item];
                }
            } else {
                result.push(item);
            }
        });
        return result;
    }

    dropAdd = (index: number, pid: number, id?: number) => {
        this.addMaterial(materialComponents[index], pid, id);
    }

    create = () => {

    }

    /**
     * 选中物料组件
     */
    selectMaterial = (material: IMaterial, materials?: IMaterial[]) => {
        if (!materials) {
            materials = [...this.props.materialList];
        }
        materials.forEach((item) => {
            if (item.id === material.id) {
                item.active = true;
            } else {
                item.active = false;
            }
        });
        this.props.setMaterialList(materials);
        this.props.setMaterial(material, material.id);
    };

    /**
     * 添加物料组件
     */
    addMaterial = (item: IMaterial, pid?: number, cid?: number) => {
        const material = cloneDeep(item);
        const materials = cloneDeep(this.props.materialList);
        let index = 0;
        materials.forEach((item, i) => {
            item.active = false;
            if (item.id === cid) {
                index = i;
            }
        });
        const key = Math.random();
        material.id = key;
        material.active = true;
        material.pid = pid || 1;
        // 没有child id 表示添加物料组件
        if (!cid) {
            materials.push(material);
            if (material.children) {
                const children = [...material.children];
                children.forEach((child) => {
                    child = cloneDeep(child); // 防止子组件相同引用地址
                    child.active = false;
                    child.pid = key;
                    child.id = Math.random();
                    materials.push(child);
                });
                delete material.children;
            }
        } else { // 有child id 表示拖拽插入指定child id上方
            materials.splice(index, 0, material);
            if (material.children) {
                let children = [...material.children];
                children = children.map((child) => {
                    child = cloneDeep(child); // 防止子组件相同引用地址
                    child.active = false;
                    child.pid = key;
                    child.id = Math.random();
                    return child;
                });
                materials.splice(index + 1, 0, ...children);
                delete material.children;
            }
        }
        this.selectMaterial(material, materials);
    };

    /**
     * 删除物料组件
     */
    deleteMaterial = (cid: number) => {
        let materials = cloneDeep(this.props.materialList);
        const ids: number[] = [cid];
        function findMaterial(pid: number) {
        materials!.forEach((material) => {
            if (material.pid === pid) {
                ids.push(material.id);
                findMaterial(material.id);
            }
        });
        }
        findMaterial(cid);
        materials = materials.filter((item) => ids.indexOf(item.id) === -1);
        this.props.setMaterialList(materials);
        this.props.setMaterial(null, 0);
    }

    findMaterialIndex(materials: IMaterial[], id: number): number {
        for (let i = 0; i < materials.length; i++) {
            if (materials[i].id === id) {
                return i;
            }
        }
        return 0;
    }

    dorpMove = (cid: number, tid: number) => {
        const materials = [...this.props.materialList];
        const cIndex = this.findMaterialIndex(materials, cid);
        const mc = materials.splice(cIndex, 1)[0];
        const tIndex = this.findMaterialIndex(materials, tid);
        const tc = materials[tIndex];
        // 判断目标物料组件是否可以有子物料
        if (tc.haveChildren) {
            mc.pid = tc.id; // 改变pid
            materials.push(mc); // 插入到最后一个
        } else {
            mc.pid = tc.pid; // 改变未目标pid
            materials.splice(tIndex, 0, mc); // 在目标物料前插入
        }
        this.props.setMaterialList(materials);
        this.props.setMaterial(mc, mc.id);
    }

    /**
     * 开始拖拽
     */
    dragStart = (id: number) => {
        // const materials = [...this.state.materialList];
        // const index = this.findMaterialIndex(materials, id);
        // const material = materials.splice(index, 1)[0];
        // this.setState({
        //     materialList: materials,
        // });
    }

    render() {
        const { visual } = this.state;
        const { materialList } = this.props;
        const materials = this.getMaterilTree(materialList);

        return (
            <>
                <div className={`light-theme ${styles.opt}`}>
                    <Button type="primary" onClick={this.create} style={{ marginRight: '20px' }}>生成</Button>
                    <Button type="primary" onClick={this.props.clear} style={{ marginRight: '20px' }}>清空</Button>
                    展示 <Switch checked={visual} onChange={value => this.setState({ visual: value })} />
                </div>
                <div className={styles.content}>
                    {
                        materials.map((item) => (
                            <MaterialBlock
                                key={item.id}
                                visual={visual}
                                material={item}
                                selectMaterial={(m) => this.selectMaterial(m)}
                                deleteMaterial={(id) => this.deleteMaterial(id)}
                                dropAdd={this.dropAdd}
                                dorpMove={this.dorpMove}
                                dragStart={this.dragStart}
                            />
                        ))
                    }
                </div>
            </>
        );
    }
}

export default MaterialContent;
