import React, {useState, useMemo, useRef} from 'react';
import {useSelector} from 'react-redux';
import {Badge} from 'antd';

import {TaskView} from './TaskView';
import {SideHeaderLayout} from '../widgets/Layout';
import {ItemBreadcrumb} from '../widgets/ItemBreadcrumb';
import {ClickableText} from '../widgets/ClickableText';

import moment from 'moment';
import {moment_to_day, days_to, friendly_date} from '../functions';

import './TodoView.less';
import {InboxOutlined, CaretUpOutlined, CaretDownOutlined} from '@ant-design/icons';

const TODO_COLLAPSED_LINES=3;

function TodoTaskView(props) {
    const project_external=useSelector((state)=>state.project[props.task.parent_id].external);

    const todo_task_container_ref=useRef(null);

    return (
        <p className="todo-task" ref={todo_task_container_ref}>
            <ItemBreadcrumb scope="project" id={props.task.parent_id} suffix="" />
            <span className="todo-task-tag">
                <TaskView
                    tid={props.task.id} external={project_external}
                    can_sort={false} popup_container_ref={todo_task_container_ref}
                />
            </span>
        </p>
    )
}

function TodoCatView(props) {
    return (
        <SideHeaderLayout headerClassName="todo-cat-container" header={<span className="should-highlight">{props.name}</span>}>
            {props.tasks.map((t)=>(
                <TodoTaskView key={t.id} task={t} />
            ))}
            <div className="project-margin" />
        </SideHeaderLayout>
    )
}

export function TodoView(props) {
    const tasks=useSelector((state)=>state.task);
    const todo_tasks=useMemo(()=>(
        tasks ? Object.values(tasks).filter((t)=>t.status==='active' && ['done','ignored'].indexOf(t.completeness)===-1) : []
    ),[tasks]);

    const [expanded,set_expanded]=useState(false);

    if(todo_tasks.length===0) {
        return (
            <div className="width-container-rightonly">
                <p>
                    &nbsp;<InboxOutlined /> 无待办任务
                </p>
                <div className="todo-task-bottom-line" />
            </div>
        );
    }

    let cats={}; // cat_name -> [task...]
    let cat_order=[]; // [[sort_key, cat_name]]

    function set_cat(sort_key,cat_name,task) {
        if(cats[cat_name]===undefined) {
            cats[cat_name]=[];
            cat_order.push([sort_key,cat_name]);
        }
        cats[cat_name].push(task);
    }

    let today=moment_to_day(moment());

    todo_tasks.forEach((t)=>{
        if(t.completeness==='highlight') return set_cat(-Infinity,'旗标',t);
        if(t.due===null) return set_cat(+Infinity,'无截止日期',t);

        let d=days_to(moment_to_day(moment.unix(t.due)),today);

        if(d<0) return set_cat(-1,'已截止',t);
        else return set_cat(d,friendly_date(t.due)+' 截止',t);
    });

    cat_order.sort((a,b)=>a[0]-b[0]);
    Object.values(cats).forEach((cat)=>{
        cat.sort((a,b)=>a.parent_id-b.parent_id)
    });

    let can_collapse=todo_tasks.length>TODO_COLLAPSED_LINES;

    if(!expanded && can_collapse) {
        let items_left=TODO_COLLAPSED_LINES;
        cat_order.forEach(([_,cat_name])=>{
            let cat=cats[cat_name];

            if(items_left===0)
                cats[cat_name]=null;
            else if(cat.length>items_left) {
                cats[cat_name]=cats[cat_name].slice(0,items_left);
                items_left=0;
            } else
                items_left-=cat.length;
        });
    }

    const TODO_TASK_BADGE_STYLE={backgroundColor: '#fff', color: '#777', boxShadow: '0 0 0 1px #777 inset'};

    return (
        <div>
            <SideHeaderLayout headerClassName="todo-header-container" header={
                <div className="should-highlight">
                    待办任务
                    <Badge count={todo_tasks.length} className="todo-task-badge" style={TODO_TASK_BADGE_STYLE} />
                </div>}
            >
                {cat_order.map(([sort_key,cat_name])=>(
                    cats[cat_name] ? <TodoCatView key={sort_key} name={cat_name} tasks={cats[cat_name]} /> : null
                ))}
                {can_collapse &&
                    <div className="width-container-rightonly">
                        <ClickableText onClick={()=>set_expanded(!expanded)} className="todo-collapse-switch have-hover-bg">
                            {expanded ?
                                <span><CaretUpOutlined /> 收起</span> :
                                <span><CaretDownOutlined /> 还有 {todo_tasks.length-TODO_COLLAPSED_LINES} 项</span>
                            }
                        </ClickableText>
                    </div>
                }
            </SideHeaderLayout>
            <div className="todo-task-bottom-margin" />
            <div className="width-container-rightonly">
                <div className="todo-task-bottom-line" />
            </div>
        </div>
    );
}