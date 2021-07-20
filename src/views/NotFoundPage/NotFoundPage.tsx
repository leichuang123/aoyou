import React from 'react';
import { Result, Button } from 'antd';
import { connect } from 'react-redux';
interface Props {
    history: any;
}

interface IState {}

class NotFoundPage extends React.PureComponent<Props, IState> {
    backClick = () => {
        this.props.history.go(-1);
    };
    render() {
        return (
            <div>
                <Result
                    status="404"
                    title="404"
                    subTitle="页面未找到"
                    extra={
                        <Button type="primary" onClick={this.backClick}>
                            返回上一页
                        </Button>
                    }
                />
            </div>
        );
    }
}

interface stateType {
    isShowLoading: Boolean;
}

export default connect((state: stateType) => ({
    isShowLoading: state.isShowLoading,
}))(NotFoundPage);
