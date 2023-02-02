import React, { useEffect, useState } from 'react';
import { Table, Tag, Typography, Card } from 'antd';
import { MobileOutlined } from '@ant-design/icons';
import NotificationModal from './NotificationComponent';
import './styles.css';

const { Title, Link } = Typography;

const columns = [
    {
        title: 'Subscriber Number',
        key: 'subscriberNumber',
        dataIndex: 'telephoneNumber',
        width: '25%',
        render: (ctn) => (
            <div className="column-device-mobile-wrapper">
                <MobileOutlined className="column-device-mobile-icon" />
                &nbsp;&nbsp;
                <span className="column-device-telephone-number">
                    {ctn
                        .toString()
                        .replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')}
                </span>
            </div>
        ),
    },
    {
        title: 'Subscriber IMEI',
        dataIndex: 'imei',
    },
    {
        title: 'Current Status',
        key: 'ptnStatus',
        dataIndex: 'ptnStatus',
        render: (tag) => (
            <>
                {tag === 'A' ? (
                    <Tag color="success" key="active">
                        ACTIVE
                    </Tag>
                ) : tag === 'S' ? (
                    <Tag color="warning" key="suspended">
                        SUSPENDED
                    </Tag>
                ) : tag === 'C' ? (
                    <Tag color="error" key="cancelled">
                        CANCELLED
                    </Tag>
                ) : tag === 'B' ? (
                    <Tag color="#8C8C8C" key="blacklisted">
                        BLACKLISTED
                    </Tag>
                ) : (
                    <Link href="#statuspage" target="_blank">
                        {tag}
                    </Link>
                )}
            </>
        ),
    },
];

export default function TableComponent(props) {
    const [exist, setExist] = useState(true);
    if (props === '' || props === null || props === undefined) {
        setExist(false);
    }
    if (exist) {
        const { component, data, children, childComponents } = props;
        const [active, setActive] = useState(0);
        const [cancelled, setCancelled] = useState(0);
        const [blacklisted, setBlacklisted] = useState(0);
        const [suspended, setSuspended] = useState(0);
        const [selectrow, setSelectrow] = useState([]);
        const [selectData, setSelectData] = useState([]);
        const [selectstatus, setSelectStatus] = useState('');
        const [hasSelected, setHasselected] = useState(selectrow.length > 0);
        const [selectedOptions, setSelectedOptions] = useState([]);
        const [lineDetailsarray, setLineDetailsarray] = useState(columnsData);

        const { params } = component;
        const { lineDetails } = data.data;
        const getTableColumnsData = (lineDetailsData) => {
            const columns =
                lineDetailsData &&
                lineDetailsData.map((dataItem, i) => {
                    const {
                        telephoneNumber,
                        subscriberNumber,
                        imei,
                        ptnStatus,
                    } = dataItem;
                    return {
                        key: i,
                        telephoneNumber: telephoneNumber,
                        subscriberNumber: subscriberNumber,
                        imei: imei,
                        ptnStatus: ptnStatus,
                    };
                });
            return columns;
        };
        const columnsData = getTableColumnsData(lineDetails);

        useEffect(() => {
            lineDetails.forEach((on) => {
                if (on.ptnStatus === 'A') {
                    setActive((prev) => prev + 1);
                } else if (on.ptnStatus === 'C') {
                    setCancelled((prev) => prev + 1);
                } else if (on.ptnStatus === 'B') {
                    setBlacklisted((prev) => prev + 1);
                } else if (on.ptnStatus === 'S') {
                    setSuspended((prev) => prev + 1);
                }
            });
        }, []);

        const onChange = (checkedValues) => {
            setSelectedOptions((selectedOptions) => [
                ...selectedOptions,
                checkedValues,
            ]);
            setSelectStatus('');
        };

        const onSelectChange = (selectrow) => {
            if (selectrow.length !== 0 && selectrow.length === 1) {
                setSelectrow((selectrow) => [...selectrow, selectrow]);
                setSelectData((selectData) => [
                    ...selectData,
                    lineDetailsarray[selectrow],
                ]);
                setSelectStatus(lineDetailsarray[selectrow].ptnStatus);
            } else if (selectrow.length > 1) {
                NotificationModal.error({
                    title: 'Error',
                    content: 'More than one row selected',
                    position: 'top-right',
                });
                // selectrow.pop();
            }
        };

        const rowSelection = {
            selectrow,
            onChange: onSelectChange,
        };
        return (
            <div>
                <div className="list">
                    <div className="activecircle"></div>
                    <span className="context">Active Lines: {active}</span>
                    <div className="cancelcircle"></div>
                    <span className="context">
                        Cancelled Lines: {cancelled}
                    </span>
                    <div className="suspendcircle"></div>
                    <span className="context">
                        Suspended Lines: {suspended}
                    </span>
                    <div className="blacklistcircle"></div>
                    <span className="context">
                        Blacklisted Lines: {blacklisted}
                    </span>
                </div>
                <div>
                    <span style={{ marginLeft: 8 }}>
                        {hasSelected
                            ? `Selected ${selectrow.length} items`
                            : ''}
                    </span>
                    <Table
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={columnsData}
                    />
                </div>
            </div>
        );
    } else {
        return (
            <div>
                <Card>
                    <Title level={3}>
                        CONFIGURATION is missing reload the component
                    </Title>
                </Card>
            </div>
        );
    }
}
