export default function FormValidation() {
    let error = false
    // 各入力項目の取得
    const name      = document.querySelector("input[name='userId']")
    const evaluation    = document.querySelector("select[name='evaluation']")
    const content    = document.querySelector("textarea[name='content']")
    // エラー出力位置の取得
    const nameError     = document.querySelector("#nameError")
    const evaluationError   = document.querySelector("#evaluationError")
    const contentError   = document.querySelector("#contentError")
    // エラーの初期化
    nameError.innerHTML     = ""
    evaluationError.innerHTML   = ""
    contentError.innerHTML   = ""

    // 名前は記号の入力は受け付けない
    const nameVal = /^[0-9０-９!?_+*'"`#$%&\-^\\@;:,./=~|[\](){}<>！？＿＋＊’”‘＃＄％＆￥－＾￥＠；：，．／＝～｜［］（）｛｝＜＞]+$/;
    if(name.value.match(nameVal) || name.value === "") {
        nameError.innerHTML = "名前を入力してください"
        error = true
    }
    // 評価が選択されているかチェック
    for(const option of evaluation.options) {
        if(option.selected) {
            if(option.value === "") {
                evaluationError.innerHTML = "評価を選択してください"
                error = true
            }
        }
    }
    // レビュー内容が入力されているかチェック
    if(content.value === "") {
        contentError.innerHTML = "レビューの内容を入力してください"
        error = true
    }
    // エラーが1つでもある場合はサーバー送信しない
    if(error) event.preventDefault()
}
