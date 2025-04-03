import { useState, useEffect } from "react";
import { notification, Button, Input, Modal } from "antd";
import "antd/dist/reset.css";
import "./index.css";

interface NewsItem {
  title: string;
  description: string;
}

export const News = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>("");
  const [editDescription, setEditDescription] = useState<string>("");

  useEffect(() => {
    const storedNews: NewsItem[] = JSON.parse(localStorage.getItem("news") || "[]");
    setNewsList(storedNews);
  }, []);

  const updateLocalStorage = (news: NewsItem[]) => {
    localStorage.setItem("news", JSON.stringify(news));
  };

  const openNotification = (type: "success" | "info", message: string) => {
    notification[type]({
      message,
      placement: "topRight",
    });
  };

  const addNewsItem = (): void => {
    if (!title.trim() || !description.trim()) return;
    const newNewsList = [...newsList, { title, description }];
    setNewsList(newNewsList);
    updateLocalStorage(newNewsList);
    setTitle("");
    setDescription("");
    openNotification("success", "Новость добавлена!");
  };

  const removeNewsItem = (index: number): void => {
    const updatedNewsList = newsList.filter((_, i) => i !== index);
    setNewsList(updatedNewsList);
    updateLocalStorage(updatedNewsList);
    openNotification("info", "Новость удалена!");
  };

  const openEditModal = (index: number) => {
    setEditIndex(index);
    setEditTitle(newsList[index].title);
    setEditDescription(newsList[index].description);
    setIsModalOpen(true);
  };

  const handleEditSave = () => {
    if (editIndex === null || !editTitle.trim() || !editDescription.trim()) return;
    const updatedNewsList = [...newsList];
    updatedNewsList[editIndex] = { title: editTitle, description: editDescription };
    setNewsList(updatedNewsList);
    updateLocalStorage(updatedNewsList);
    setIsModalOpen(false);
    openNotification("success", "Новость обновлена!");
  };

  return (
    <div className="container">
      <div className="input-container">
        <h2>Добавить новость</h2>
        <Input
          type="text"
          placeholder="Заголовок"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input.TextArea
          placeholder="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button type="primary" onClick={addNewsItem}>Добавить</Button>
      </div>
      <div className="news-list">
        <h2>Новости</h2>
        <ul>
          {newsList.map((news, index) => (
            <li key={index}>
              <div className="news-item">
                <div>
                  <strong>{news.title}</strong>
                  <p>{news.description}</p>
                </div>
                <div>
                  <Button style={{background: "green"}} onClick={() => openEditModal(index)}>Редактировать</Button>
                  <Button style={{background: "red"}} danger onClick={() => removeNewsItem(index)}>Удалить</Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Modal
        title="Редактировать новость"
        open={isModalOpen}
        onOk={handleEditSave}
        onCancel={() => setIsModalOpen(false)}
      >
        <Input
          type="text"
          placeholder="Заголовок"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
        />
        <Input.TextArea
          placeholder="Описание"
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
        />
      </Modal>
    </div>
  );
};
