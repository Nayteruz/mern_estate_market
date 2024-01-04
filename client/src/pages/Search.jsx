const Search = () => {
  return (
    <div className="flex flex-col md:flex-row w-full">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen select-none">
        <form className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label htmlFor="seachTerm" className="text-nowrap font-semibold">
              Поиск по:
            </label>
            <input
              type="text"
              name="searchTerm"
              id="searchTerm"
              placeholder="Поиск..."
              className="border rounded-lg p-3 w-full"
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Тип:</label>
            <div className="flex gap-2">
              <input type="checkbox" id="all" className="w-5" />
              <label htmlFor="all">Аренда и продажа</label>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <label htmlFor="rent">Аренда</label>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" />
              <label htmlFor="sale">Продажа</label>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
              <label htmlFor="offer">Агент</label>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Удобства:</label>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" />
              <label htmlFor="parking">Парковка</label>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <label htmlFor="furnished">Мебелиронная</label>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="sort_order" className="text-nowrap font-semibold">
              Сортировать:
            </label>
            <select id="sort_order" className="border rounded-lg p-3">
              <option>Цена по убыванию</option>
              <option>Цена по возрастанию</option>
              <option>По дате новые</option>
              <option>По дате старые</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
          >
            Поиск
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Результаты поиска:
        </h1>
      </div>
    </div>
  );
};

export default Search;
