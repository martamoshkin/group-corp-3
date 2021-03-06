import React, { useRef, useState, MouseEvent } from "react";
import { Popover, Overlay, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { chatsNewSend } from "../../../actions/chats/new";
import { AppState } from "../../../reducers";
import { useTranslation } from "react-i18next";
import { push } from "connected-react-router";

export const NewChat = () => {
    const { t } = useTranslation();

    const [showCreateChat, setShowCreateChat] = useState<boolean>(false);
    const [createChatTarget, setCreateChatTarget] = useState<HTMLDivElement | null>(null);
    const ref = useRef(null);

    const dispatch = useDispatch();

    const handleClickCreateChat = (event: MouseEvent<HTMLDivElement>) => {
        if (!createChatTarget) {
            setCreateChatTarget(event.target as HTMLDivElement);
        }

        setShowCreateChat(true);
    };

    const chatIds = useSelector<AppState, number[]>((state: AppState) => state.chats.items.map((item: Chat): number => item.author.id));
    const authors: Author[] = useSelector<AppState, User[]>((state: AppState) => state.users.items.filter((u: User) => !chatIds.includes(u.id)));

    const handleCreateChat = (author: Author): void => {
        const chatId = Date.now();
        dispatch(chatsNewSend(author, chatId));
        dispatch(push(`/chat/${chatId}`));
        setShowCreateChat(false);
    };

    return <>
        <Overlay
            show={showCreateChat}
            target={createChatTarget}
            placement="top"
            container={ref.current}
            containerPadding={20}
        >
            <Popover id="popover-contained" className="create-chat-popover">
                <Popover.Content className="p-0 text-center">
                    {!!authors.length ? authors.map((author: Author) => <div key={author.id} onClick={() => handleCreateChat(author)} className="user py-1 px-2 d-flex align-items-center">
                        <Image className="avatar" src={author.avatar} rounded /><span className="ml-2">{author.name}</span></div>) : <span className="p-5 text-center">{t('ALL_CHATS_IS_ACTIVE')}</span>}
                </Popover.Content>
            </Popover>
        </Overlay>

        <div className="add-new-chat chat-field text-center d-flex justify-content-between"
            onClick={handleClickCreateChat}>
            <div><span>{t('NEW_CHAT')}</span></div>
            <div><i className="fas fa-plus"></i></div>
        </div>
    </>;
};