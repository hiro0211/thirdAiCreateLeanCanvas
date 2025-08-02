高度なチャットアプリ API
チャットアプリケーションはセッションの持続性をサポートしており、以前のチャット履歴を応答のコンテキストとして使用できます。これは、チャットボットやカスタマーサービス AI などに適用できます。

ベース URL
コード
https://api.dify.ai/v1

Copy
Copied!
認証
サービス API は API-Key 認証を使用します。 API キーはサーバー側に保存し、クライアント側で共有または保存しないことを強くお勧めします。API キーの漏洩は深刻な結果を招く可能性があります。

すべての API リクエストには、以下のように AuthorizationHTTP ヘッダーに API キーを含めてください：

コード
  Authorization: Bearer {API_KEY}


Copy
Copied!
POST
/chat-messages
チャットメッセージを送信
チャットアプリケーションにリクエストを送信します。

リクエストボディ
Name
query
Type
string
Description
ユーザー入力/質問内容

Name
inputs
Type
object
Description
アプリによって定義されたさまざまな変数値の入力を許可します。 inputsパラメータには複数のキー/値ペアが含まれ、各キーは特定の変数に対応し、各値はその変数の特定の値です。 変数がファイルタイプの場合、以下のfilesで説明されているキーを持つオブジェクトを指定します。 デフォルト{}

Name
response_mode
Type
string
Description
応答の返却モードを指定します。サポートされているモード：

streaming ストリーミングモード（推奨）、SSE（サーバー送信イベント）を通じてタイプライターのような出力を実装します。
blocking ブロッキングモード、実行完了後に結果を返します。（プロセスが長い場合、リクエストが中断される可能性があります） Cloudflareの制限により、リクエストは100秒後に返答なしで中断されます。
Name
user
Type
string
Description
ユーザー識別子、エンドユーザーの身元を定義するために使用され、統計のために使用されます。 アプリケーション内で開発者によって一意に定義されるべきです。サービス API は WebApp によって作成された会話を共有しません。

Name
conversation_id
Type
string
Description
会話ID、以前のチャット記録に基づいて会話を続けるには、以前のメッセージのconversation_idを渡す必要があります。

Name
files
Type
array[object]
Description
ファイルリスト、テキストの理解と質問への回答を組み合わせたファイルの入力に適しており、モデルがビジョン機能をサポートしている場合にのみ利用可能です。

type (string) サポートされているタイプ：
document ('TXT', 'MD', 'MARKDOWN', 'PDF', 'HTML', 'XLSX', 'XLS', 'DOCX', 'CSV', 'EML', 'MSG', 'PPTX', 'PPT', 'XML', 'EPUB')
image ('JPG', 'JPEG', 'PNG', 'GIF', 'WEBP', 'SVG')
audio ('MP3', 'M4A', 'WAV', 'WEBM', 'AMR')
video ('MP4', 'MOV', 'MPEG', 'MPGA')
custom (他のファイルタイプ)
transfer_method (string) 転送方法、画像URLの場合はremote_url / ファイルアップロードの場合はlocal_file
url (string) 画像URL（転送方法がremote_urlの場合）
upload_file_id (string) アップロードされたファイルID、事前にファイルアップロードAPIを通じて取得する必要があります（転送方法がlocal_fileの場合）
Name
auto_generate_name
Type
bool
Description
タイトルを自動生成、デフォルトはtrue。 falseに設定すると、会話のリネームAPIを呼び出し、auto_generateをtrueに設定することで非同期タイトル生成を実現できます。

Name
trace_id
Type
string
Description
（オプション）トレースID。既存の業務システムのトレースコンポーネントと連携し、エンドツーエンドの分散トレーシングを実現するために使用します。指定がない場合、システムが自動的に trace_id を生成します。以下の3つの方法で渡すことができ、優先順位は次のとおりです：

Header：HTTPヘッダー X-Trace-Id で渡す（最優先）。
クエリパラメータ：URLクエリパラメータ trace_id で渡す。
リクエストボディ：リクエストボディの trace_id フィールドで渡す（本フィールド）。
応答
response_modeがブロッキングの場合、CompletionResponseオブジェクトを返します。 response_modeがストリーミングの場合、ChunkCompletionResponseストリームを返します。

ChatCompletionResponse
完全なアプリ結果を返します。Content-Typeはapplication/jsonです。

event (string) イベントタイプ、固定で message
task_id (string) タスクID、リクエスト追跡と以下のStop Generate APIに使用
id (string) ユニークID
message_id (string) 一意のメッセージID
conversation_id (string) 会話ID
mode (string) アプリモード、chatとして固定
answer (string) 完全な応答内容
metadata (object) メタデータ
usage (Usage) モデル使用情報
retriever_resources (array[RetrieverResource]) 引用と帰属リスト
created_at (int) メッセージ作成タイムスタンプ、例：1705395332
ChunkChatCompletionResponse
アプリによって出力されたストリームチャンクを返します。Content-Typeはtext/event-streamです。 各ストリーミングチャンクはdata:で始まり、2つの改行文字\n\nで区切られます。以下のように表示されます：

data: {"event": "message", "task_id": "900bbd43-dc0b-4383-a372-aa6e6c414227", "id": "663c5084-a254-4040-8ad3-51f2a3c1a77c", "answer": "Hi", "created_at": 1705398420}\n\n

Copy
Copied!
ストリーミングチャンクの構造はeventに応じて異なります：

event: message LLMがテキストチャンクイベントを返します。つまり、完全なテキストがチャンク形式で出力されます。
task_id (string) タスクID、リクエスト追跡と以下のStop Generate APIに使用
message_id (string) 一意のメッセージID
conversation_id (string) 会話ID
answer (string) LLMが返したテキストチャンク内容
created_at (int) 作成タイムスタンプ、例：1705395332
event: message_file メッセージファイルイベント、ツールによって新しいファイルが作成されました
id (string) ファイル一意ID
type (string) ファイルタイプ、現在は"image"のみ許可
belongs_to (string) 所属、ここでは'assistant'のみ
url (string) ファイルのリモートURL
conversation_id (string) 会話ID
event: message_end メッセージ終了イベント、このイベントを受信するとストリーミングが終了したことを意味します。
task_id (string) タスクID、リクエスト追跡と以下のStop Generate APIに使用
message_id (string) 一意のメッセージID
conversation_id (string) 会話ID
metadata (object) メタデータ
usage (Usage) モデル使用情報
retriever_resources (array[RetrieverResource]) 引用と帰属リスト
event: tts_message TTSオーディオストリームイベント、つまり音声合成出力。内容はMp3形式のオーディオブロックで、base64文字列としてエンコードされています。再生時には、base64をデコードしてプレーヤーに入力するだけです。（このメッセージは自動再生が有効な場合にのみ利用可能）
task_id (string) タスクID、リクエスト追跡と以下のストップ応答インターフェースに使用
message_id (string) 一意のメッセージID
audio (string) 音声合成後のオーディオ、base64テキストコンテンツとしてエンコードされており、再生時にはbase64をデコードしてプレーヤーに入力するだけです
created_at (int) 作成タイムスタンプ、例：1705395332
event: tts_message_end TTSオーディオストリーム終了イベント、このイベントを受信するとオーディオストリームが終了したことを示します。
task_id (string) タスクID、リクエスト追跡と以下のストップ応答インターフェースに使用
message_id (string) 一意のメッセージID
audio (string) 終了イベントにはオーディオがないため、これは空の文字列です
created_at (int) 作成タイムスタンプ、例：1705395332
event: message_replace メッセージ内容置換イベント。 出力内容のモデレーションが有効な場合、内容がフラグ付けされると、このイベントを通じてメッセージ内容がプリセットの返信に置き換えられます。
task_id (string) タスクID、リクエスト追跡と以下のStop Generate APIに使用
message_id (string) 一意のメッセージID
conversation_id (string) 会話ID
answer (string) 置換内容（すべてのLLM返信テキストを直接置き換えます）
created_at (int) 作成タイムスタンプ、例：1705395332
event: workflow_started ワークフローが実行を開始
task_id (string) タスクID、リクエスト追跡と以下のStop Generate APIに使用
workflow_run_id (string) ワークフロー実行の一意ID
event (string) workflow_startedに固定
data (object) 詳細
id (string) ワークフロー実行の一意ID
workflow_id (string) 関連ワークフローのID
created_at (timestamp) 作成タイムスタンプ、例：1705395332
event: node_started ノード実行が開始
task_id (string) タスクID、リクエスト追跡と以下のStop Generate APIに使用
workflow_run_id (string) ワークフロー実行の一意ID
event (string) node_startedに固定
data (object) 詳細
id (string) ワークフロー実行の一意ID
node_id (string) ノードのID
node_type (string) ノードのタイプ
title (string) ノードの名前
index (int) 実行シーケンス番号、トレースノードシーケンスを表示するために使用
predecessor_node_id (string) オプションのプレフィックスノードID、キャンバス表示実行パスに使用
inputs (object) ノードで使用されるすべての前のノード変数の内容
created_at (timestamp) 開始のタイムスタンプ、例：1705395332
event: node_finished ノード実行が終了、成功または失敗は同じイベント内で異なる状態で示されます
task_id (string) タスクID、リクエスト追跡と以下のStop Generate APIに使用
workflow_run_id (string) ワークフロー実行の一意ID
event (string) node_finishedに固定
data (object) 詳細
id (string) ワークフロー実行の一意ID
node_id (string) ノードのID
node_type (string) ノードのタイプ
title (string) ノードの名前
index (int) 実行シーケンス番号、トレースノードシーケンスを表示するために使用
predecessor_node_id (string) オプションのプレフィックスノードID、キャンバス表示実行パスに使用
inputs (object) ノードで使用されるすべての前のノード変数の内容
process_data (json) オプションのノードプロセスデータ
outputs (json) オプションの出力内容
status (string) 実行の状態、running / succeeded / failed / stopped
error (string) オプションのエラー理由
elapsed_time (float) オプションの使用される合計秒数
execution_metadata (json) メタデータ
total_tokens (int) オプションの使用されるトークン数
total_price (decimal) オプションの合計コスト
currency (string) オプション、例：USD / RMB
created_at (timestamp) 開始のタイムスタンプ、例：1705395332
event: workflow_finished ワークフロー実行が終了、成功または失敗は同じイベント内で異なる状態で示されます
task_id (string) タスクID、リクエスト追跡と以下のStop Generate APIに使用
workflow_run_id (string) ワークフロー実行の一意ID
event (string) workflow_finishedに固定
data (object) 詳細
id (string) ワークフロー実行のID
workflow_id (string) 関連ワークフローのID
status (string) 実行の状態、running / succeeded / failed / stopped
outputs (json) オプションの出力内容
error (string) オプションのエラー理由
elapsed_time (float) オプションの使用される合計秒数
total_tokens (int) オプションの使用されるトークン数
total_steps (int) デフォルト0
created_at (timestamp) 開始時間
finished_at (timestamp) 終了時間
event: error ストリーミングプロセス中に発生する例外はストリームイベントの形式で出力され、エラーイベントを受信するとストリームが終了します。
task_id (string) タスクID、リクエスト追跡と以下のStop Generate APIに使用
message_id (string) 一意のメッセージID
status (int) HTTPステータスコード
code (string) エラーコード
message (string) エラーメッセージ
event: ping 接続を維持するために10秒ごとにpingイベントが発生します。
エラー
404, 会話が存在しません
400, invalid_param, 異常なパラメータ入力
400, app_unavailable, アプリ構成が利用できません
400, provider_not_initialize, 利用可能なモデル資格情報構成がありません
400, provider_quota_exceeded, モデル呼び出しクォータが不足しています
400, model_currently_not_support, 現在のモデルが利用できません
400, completion_request_error, テキスト生成に失敗しました
500, 内部サーバーエラー
リクエスト
POST
/chat-messages
curl -X POST 'https://api.dify.ai/v1/chat-messages' \
--header 'Authorization: Bearer {api_key}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "inputs": {},
    "query": "iPhone 13 Pro Maxの仕様は何ですか？",
    "response_mode": "streaming",
    "conversation_id": "",
    "user": "abc-123",
    "files": [
      {
        "type": "image",
        "transfer_method": "remote_url",
        "url": "https://cloud.dify.ai/logo/logo-site.png"
      }
    ]
}'

Copy
Copied!
ブロッキングモード
応答
{
    "event": "message",
    "task_id": "c3800678-a077-43df-a102-53f23ed20b88", 
    "id": "9da23599-e713-473b-982c-4328d4f5c78a",
    "message_id": "9da23599-e713-473b-982c-4328d4f5c78a",
    "conversation_id": "45701982-8118-4bc5-8e9b-64562b4555f2",
    "mode": "chat",
    "answer": "iPhone 13 Pro Maxの仕様は次のとおりです:...",
    "metadata": {
        "usage": {
            "prompt_tokens": 1033,
            "prompt_unit_price": "0.001",
            "prompt_price_unit": "0.001",
            "prompt_price": "0.0010330",
            "completion_tokens": 128,
            "completion_unit_price": "0.002",
            "completion_price_unit": "0.001",
            "completion_price": "0.0002560",
            "total_tokens": 1161,
            "total_price": "0.0012890",
            "currency": "USD",
            "latency": 0.7682376249867957
        },
        "retriever_resources": [
            {
                "position": 1,
                "dataset_id": "101b4c97-fc2e-463c-90b1-5261a4cdcafb",
                "dataset_name": "iPhone",
                "document_id": "8dd1ad74-0b5f-4175-b735-7d98bbbb4e00",
                "document_name": "iPhone List",
                "segment_id": "ed599c7f-2766-4294-9d1d-e5235a61270a",
                "score": 0.98457545,
                "content": "\"Model\",\"Release Date\",\"Display Size\",\"Resolution\",\"Processor\",\"RAM\",\"Storage\",\"Camera\",\"Battery\",\"Operating System\"\n\"iPhone 13 Pro Max\",\"September 24, 2021\",\"6.7 inch\",\"1284 x 2778\",\"Hexa-core (2x3.23 GHz Avalanche + 4x1.82 GHz Blizzard)\",\"6 GB\",\"128, 256, 512 GB, 1TB\",\"12 MP\",\"4352 mAh\",\"iOS 15\""
            }
        ]
    },
    "created_at": 1705407629
}

Copy
Copied!
ストリーミングモード
応答
  data: {"event": "workflow_started", "task_id": "5ad4cb98-f0c7-4085-b384-88c403be6290", "workflow_run_id": "5ad498-f0c7-4085-b384-88cbe6290", "data": {"id": "5ad498-f0c7-4085-b384-88cbe6290", "workflow_id": "dfjasklfjdslag", "created_at": 1679586595}}
  data: {"event": "node_started", "task_id": "5ad4cb98-f0c7-4085-b384-88c403be6290", "workflow_run_id": "5ad498-f0c7-4085-b384-88cbe6290", "data": {"id": "5ad498-f0c7-4085-b384-88cbe6290", "node_id": "dfjasklfjdslag", "node_type": "start", "title": "Start", "index": 0, "predecessor_node_id": "fdljewklfklgejlglsd", "inputs": {}, "created_at": 1679586595}}
  data: {"event": "node_finished", "task_id": "5ad4cb98-f0c7-4085-b384-88c403be6290", "workflow_run_id": "5ad498-f0c7-4085-b384-88cbe6290", "data": {"id": "5ad498-f0c7-4085-b384-88cbe6290", "node_id": "dfjasklfjdslag", "node_type": "start", "title": "Start", "index": 0, "predecessor_node_id": "fdljewklfklgejlglsd", "inputs": {}, "outputs": {}, "status": "succeeded", "elapsed_time": 0.324, "execution_metadata": {"total_tokens": 63127864, "total_price": 2.378, "currency": "USD"},  "created_at": 1679586595}}
  data: {"event": "workflow_finished", "task_id": "5ad4cb98-f0c7-4085-b384-88c403be6290", "workflow_run_id": "5ad498-f0c7-4085-b384-88cbe6290", "data": {"id": "5ad498-f0c7-4085-b384-88cbe6290", "workflow_id": "dfjasklfjdslag", "outputs": {}, "status": "succeeded", "elapsed_time": 0.324, "total_tokens": 63127864, "total_steps": "1", "created_at": 1679586595, "finished_at": 1679976595}}
  data: {"event": "message", "message_id": "5ad4cb98-f0c7-4085-b384-88c403be6290", "conversation_id": "45701982-8118-4bc5-8e9b-64562b4555f2", "answer": " I", "created_at": 1679586595}
  data: {"event": "message", "message_id": "5ad4cb98-f0c7-4085-b384-88c403be6290", "conversation_id": "45701982-8118-4bc5-8e9b-64562b4555f2", "answer": "'m", "created_at": 1679586595}
  data: {"event": "message", "message_id": "5ad4cb98-f0c7-4085-b384-88c403be6290", "conversation_id": "45701982-8118-4bc5-8e9b-64562b4555f2", "answer": " glad", "created_at": 1679586595}
  data: {"event": "message", "message_id": "5ad4cb98-f0c7-4085-b384-88c403be6290", "conversation_id": "45701982-8118-4bc5-8e9b-64562b4555f2", "answer": " to", "created_at": 1679586595}
  data: {"event": "message", "message_id" : "5ad4cb98-f0c7-4085-b384-88c403be6290", "conversation_id": "45701982-8118-4bc5-8e9b-64562b4555f2", "answer": " meet", "created_at": 1679586595}
  data: {"event": "message", "message_id" : "5ad4cb98-f0c7-4085-b384-88c403be6290", "conversation_id": "45701982-8118-4bc5-8e9b-64562b4555f2", "answer": " you", "created_at": 1679586595}
  data: {"event": "message_end", "id": "5e52ce04-874b-4d27-9045-b3bc80def685", "conversation_id": "45701982-8118-4bc5-8e9b-64562b4555f2", "metadata": {"usage": {"prompt_tokens": 1033, "prompt_unit_price": "0.001", "prompt_price_unit": "0.001", "prompt_price": "0.0010330", "completion_tokens": 135, "completion_unit_price": "0.002", "completion_price_unit": "0.001", "completion_price": "0.0002700", "total_tokens": 1168, "total_price": "0.0013030", "currency": "USD", "latency": 1.381760165997548}, "retriever_resources": [{"position": 1, "dataset_id": "101b4c97-fc2e-463c-90b1-5261a4cdcafb", "dataset_name": "iPhone", "document_id": "8dd1ad74-0b5f-4175-b735-7d98bbbb4e00", "document_name": "iPhone List", "segment_id": "ed599c7f-2766-4294-9d1d-e5235a61270a", "score": 0.98457545, "content": "\"Model\",\"Release Date\",\"Display Size\",\"Resolution\",\"Processor\",\"RAM\",\"Storage\",\"Camera\",\"Battery\",\"Operating System\"\n\"iPhone 13 Pro Max\",\"September 24, 2021\",\"6.7 inch\",\"1284 x 2778\",\"Hexa-core (2x3.23 GHz Avalanche + 4x1.82 GHz Blizzard)\",\"6 GB\",\"128, 256, 512 GB, 1TB\",\"12 MP\",\"4352 mAh\",\"iOS 15\""}]}}
  data: {"event": "tts_message", "conversation_id": "23dd85f3-1a41-4ea0-b7a9-062734ccfaf9", "message_id": "a8bdc41c-13b2-4c18-bfd9-054b9803038c", "created_at": 1721205487, "task_id": "3bf8a0bb-e73b-4690-9e66-4e429bad8ee7", "audio": "qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq"}
  data: {"event": "tts_message_end", "conversation_id": "23dd85f3-1a41-4ea0-b7a9-062734ccfaf9", "message_id": "a8bdc41c-13b2-4c18-bfd9-054b9803038c", "created_at": 1721205487, "task_id": "3bf8a0bb-e73b-4690-9e66-4e429bad8ee7", "audio": ""}

Copy
Copied!
POST
/files/upload
ファイルアップロード
メッセージ送信時に使用するファイルをアップロードし、画像とテキストのマルチモーダル理解を可能にします。 アプリケーションでサポートされている形式をサポートします。 アップロードされたファイルは現在のエンドユーザーのみが使用できます。

リクエストボディ
このインターフェースはmultipart/form-dataリクエストを必要とします。

file (File) 必須 アップロードするファイル。
user (string) 必須 ユーザー識別子、開発者のルールによって定義され、アプリケーション内で一意でなければなりません。サービス API は WebApp によって作成された会話を共有しません。
応答
アップロードが成功すると、サーバーはファイルの ID と関連情報を返します。

id (uuid) ID
name (string) ファイル名
size (int) ファイルサイズ（バイト）
extension (string) ファイル拡張子
mime_type (string) ファイルの MIME タイプ
created_by (uuid) エンドユーザーID
created_at (timestamp) 作成タイムスタンプ、例：1705395332
エラー
400, no_file_uploaded, ファイルが提供されなければなりません
400, too_many_files, 現在は 1 つのファイルのみ受け付けます
400, unsupported_preview, ファイルはプレビューをサポートしていません
400, unsupported_estimate, ファイルは推定をサポートしていません
413, file_too_large, ファイルが大きすぎます
415, unsupported_file_type, サポートされていない拡張子、現在はドキュメントファイルのみ受け付けます
503, s3_connection_failed, S3 サービスに接続できません
503, s3_permission_denied, S3 にファイルをアップロードする権限がありません
503, s3_file_too_large, ファイルが S3 のサイズ制限を超えています
500, 内部サーバーエラー
リクエスト例
リクエスト
POST
/files/upload
curl -X POST 'https://api.dify.ai/v1/files/upload' \
--header 'Authorization: Bearer {api_key}' \
--form 'file=@localfile;type=image/[png|jpeg|jpg|webp|gif]' \
--form 'user=abc-123'

Copy
Copied!
応答例
応答
{
  "id": "72fa9618-8f89-4a37-9b33-7e1178a24a67",
  "name": "example.png",
  "size": 1024,
  "extension": "png",
  "mime_type": "image/png",
  "created_by": "6ad1ab0a-73ff-4ac1-b9e4-cdb312f71f13",
  "created_at": 1577836800,
}

Copy
Copied!
POST
/chat-messages/:task_id/stop
生成を停止
ストリーミングモードでのみサポートされています。

パス
task_id (string) タスク ID、ストリーミングチャンクの返り値から取得できます
リクエストボディ
user (string) 必須 ユーザー識別子、エンドユーザーの身元を定義するために使用され、送信メッセージインターフェースで渡されたユーザーと一致している必要があります。サービス API は WebApp によって作成された会話を共有しません。
応答
result (string) 常に"success"を返します
リクエスト例
リクエスト
POST
/chat-messages/:task_id/stop
curl -X POST 'https://api.dify.ai/v1/chat-messages/:task_id/stop' \
-H 'Authorization: Bearer {api_key}' \
-H 'Content-Type: application/json' \
--data-raw '{"user": "abc-123"}'

Copy
Copied!
応答例
応答
{
  "result": "success"
}

Copy
Copied!
POST
/messages/:message_id/feedbacks
メッセージフィードバック
エンドユーザーはフィードバックメッセージを提供でき、アプリケーション開発者が期待される出力を最適化するのを支援します。

パス
Name
message_id
Type
string
Description
メッセージID

リクエストボディ
Name
rating
Type
string
Description
アップボートはlike、ダウンボートはdislike、アップボートの取り消しはnull

Name
user
Type
string
Description
ユーザー識別子、開発者のルールによって定義され、アプリケーション内で一意でなければなりません。

Name
content
Type
string
Description
メッセージのフィードバックです。

応答
result (string) 常に"success"を返します
リクエスト
POST
/messages/:message_id/feedbacks
curl -X POST 'https://api.dify.ai/v1/messages/:message_id/feedbacks \
 --header 'Authorization: Bearer {api_key}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "rating": "like",
    "user": "abc-123",
    "content": "message feedback information"
}'

Copy
Copied!
応答
{
  "result": "success"
}

Copy
Copied!
GET
/app/feedbacks
アプリのメッセージの「いいね」とフィードバックを取得
アプリのエンドユーザーからのフィードバックや「いいね」を取得します。

クエリ
Name
page
Type
string
Description
（任意）ページ番号。デフォルト値：1

Name
limit
Type
string
Description
（任意）1ページあたりの件数。デフォルト値：20

レスポンス
data (リスト) このアプリの「いいね」とフィードバックの一覧を返します。
Request
GET
/app/feedbacks
curl -X GET 'https://api.dify.ai/v1/app/feedbacks?page=1&limit=20'

Copy
Copied!
Response
    {
    "data": [
        {
            "id": "8c0fbed8-e2f9-49ff-9f0e-15a35bdd0e25",
            "app_id": "f252d396-fe48-450e-94ec-e184218e7346",
            "conversation_id": "2397604b-9deb-430e-b285-4726e51fd62d",
            "message_id": "709c0b0f-0a96-4a4e-91a4-ec0889937b11",
            "rating": "like",
            "content": "message feedback information-3",
            "from_source": "user",
            "from_end_user_id": "74286412-9a1a-42c1-929c-01edb1d381d5",
            "from_account_id": null,
            "created_at": "2025-04-24T09:24:38",
            "updated_at": "2025-04-24T09:24:38"
        }
    ]
    }

Copy
Copied!
GET
/messages/{message_id}/suggested
次の推奨質問
現在のメッセージに対する次の質問の提案を取得します

パスパラメータ
Name
message_id
Type
string
Description
メッセージID

クエリ
Name
user
Type
string
Description
ユーザー識別子、エンドユーザーの身元を定義するために使用され、統計のために使用されます。 アプリケーション内で開発者によって一意に定義されるべきです。

リクエスト
GET
/messages/{message_id}/suggested
curl --location --request GET 'https://api.dify.ai/v1/messages/{message_id}/suggested?user=abc-123& \
--header 'Authorization: Bearer ENTER-YOUR-SECRET-KEY' \
--header 'Content-Type: application/json'

Copy
Copied!
応答
{
  "result": "success",
  "data": [
        "a",
        "b",
        "c"
    ]
}

Copy
Copied!
GET
/messages
会話履歴メッセージを取得
スクロールロード形式で履歴チャット記録を返し、最初のページは最新の{limit}メッセージを返します。つまり、逆順です。

クエリ
Name
conversation_id
Type
string
Description
会話ID

Name
user
Type
string
Description
ユーザー識別子、エンドユーザーの身元を定義するために使用され、統計のために使用されます。 アプリケーション内で開発者によって一意に定義されるべきです。

Name
first_id
Type
string
Description
現在のページの最初のチャット記録のID、デフォルトはnullです。

Name
limit
Type
int
Description
1回のリクエストで返すチャット履歴メッセージの数、デフォルトは20です。

応答
data (array[object]) メッセージリスト
id (string) メッセージID
conversation_id (string) 会話ID
inputs (object) ユーザー入力パラメータ。
query (string) ユーザー入力/質問内容。
message_files (array[object]) メッセージファイル
id (string) ID
type (string) ファイルタイプ、画像の場合はimage
url (string) プレビュー画像URL
belongs_to (string) 所属、userまたはassistant
answer (string) 応答メッセージ内容
created_at (timestamp) 作成タイムスタンプ、例：1705395332
feedback (object) フィードバック情報
rating (string) アップボートはlike / ダウンボートはdislike
retriever_resources (array[RetrieverResource]) 引用と帰属リスト
has_more (bool) 次のページがあるかどうか
limit (int) 返された項目数、入力がシステム制限を超える場合、システム制限数を返します
リクエスト
GET
/messages
curl -X GET 'https://api.dify.ai/v1/messages?user=abc-123&conversation_id='\
 --header 'Authorization: Bearer {api_key}'

Copy
Copied!
応答例
応答
{
  "limit": 20,
  "has_more": false,
  "data": [
    {
        "id": "a076a87f-31e5-48dc-b452-0061adbbc922",
        "conversation_id": "cd78daf6-f9e4-4463-9ff2-54257230a0ce",
        "inputs": {
            "name": "dify"
        },
        "query": "iphone 13 pro",
        "answer": "iPhone 13 Proは2021年9月24日に発売され、6.1インチのディスプレイと1170 x 2532の解像度を備えています。Hexa-core (2x3.23 GHz Avalanche + 4x1.82 GHz Blizzard)プロセッサ、6 GBのRAMを搭載し、128 GB、256 GB、512 GB、1 TBのストレージオプションを提供します。カメラは12 MP、バッテリー容量は3095 mAhで、iOS 15を搭載しています。",
        "message_files": [],
        "feedback": null,
        "retriever_resources": [
            {
                "position": 1,
                "dataset_id": "101b4c97-fc2e-463c-90b1-5261a4cdcafb",
                "dataset_name": "iPhone",
                "document_id": "8dd1ad74-0b5f-4175-b735-7d98bbbb4e00",
                "document_name": "iPhone List",
                "segment_id": "ed599c7f-2766-4294-9d1d-e5235a61270a",
                "score": 0.98457545,
                "content": "\"Model\",\"Release Date\",\"Display Size\",\"Resolution\",\"Processor\",\"RAM\",\"Storage\",\"Camera\",\"Battery\",\"Operating System\"\n\"iPhone 13 Pro Max\",\"September 24, 2021\",\"6.7 inch\",\"1284 x 2778\",\"Hexa-core (2x3.23 GHz Avalanche + 4x1.82 GHz Blizzard)\",\"6 GB\",\"128, 256, 512 GB, 1TB\",\"12 MP\",\"4352 mAh\",\"iOS 15\""
            }
        ],
        "created_at": 1705569239,
    }
  ]
}

Copy
Copied!
GET
/conversations
会話を取得
現在のユーザーの会話リストを取得し、デフォルトで最新の 20 件を返します。

クエリ
Name
user
Type
string
Description
ユーザー識別子、エンドユーザーの身元を定義するために使用され、統計のために使用されます。 アプリケーション内で開発者によって一意に定義されるべきです。

Name
last_id
Type
string
Description
(Optional)現在のページの最後の記録のID、デフォルトはnullです。

Name
limit
Type
int
Description
(Optional)1回のリクエストで返す記録の数、デフォルトは最新の20件です。最大100、最小1。

Name
sort_by
Type
string
Description
(Optional)ソートフィールド、デフォルト：-updated_at（更新時間で降順にソート）

利用可能な値：created_at, -created_at, updated_at, -updated_at
フィールドの前の記号は順序または逆順を表し、"-"は逆順を表します。
応答
data (array[object]) 会話のリスト
id (string) 会話ID
name (string) 会話名、デフォルトではLLMによって生成されます。
inputs (object) ユーザー入力パラメータ。
introduction (string) 紹介
created_at (timestamp) 作成タイムスタンプ、例：1705395332
updated_at (timestamp) 更新タイムスタンプ、例：1705395332
has_more (bool)
limit (int) 返されたエントリ数、入力がシステム制限を超える場合、システム制限数が返されます
リクエスト
GET
/conversations
curl -X GET 'https://api.dify.ai/v1/conversations?user=abc-123&last_id=&limit=20' \
 --header 'Authorization: Bearer {api_key}'

Copy
Copied!
応答
{
  "limit": 20,
  "has_more": false,
  "data": [
    {
      "id": "10799fb8-64f7-4296-bbf7-b42bfbe0ae54",
      "name": "新しいチャット",
      "inputs": {
          "book": "book",
          "myName": "Lucy"
      },
      "status": "normal",
      "created_at": 1679667915,
      "updated_at": 1679667915
    },
    {
      "id": "hSIhXBhNe8X1d8Et"
      // ...
    }
  ]
}

Copy
Copied!
DELETE
/conversations/:conversation_id
会話を削除
会話を削除します。

パス
conversation_id (string) 会話ID
リクエストボディ
Name
user
Type
string
Description
ユーザー識別子、開発者によって定義され、アプリケーション内で一意であることを保証しなければなりません。

応答
result (string) 常に"success"を返します
リクエスト
DELETE
/conversations/:conversation_id
curl -X DELETE 'https://api.dify.ai/v1/conversations/:conversation_id' \
--header 'Authorization: Bearer {api_key}' \
--header 'Content-Type: application/json' \
--data-raw '{ 
 "user": "abc-123"
}'

Copy
Copied!
応答
204 No Content

Copy
Copied!
POST
/conversations/:conversation_id/name
会話の名前を変更
リクエストボディ
セッションの名前を変更します。セッション名は、複数のセッションをサポートするクライアントでの表示に使用されます。

パス
conversation_id (string) 会話ID
Name
name
Type
string
Description
(Optional)会話の名前。auto_generateがtrueに設定されている場合、このパラメータは省略できます。

Name
auto_generate
Type
bool
Description
(Optional)タイトルを自動生成、デフォルトはfalse

Name
user
Type
string
Description
ユーザー識別子、開発者によって定義され、アプリケーション内で一意であることを保証しなければなりません。

応答
id (string) 会話ID
name (string) 会話名
inputs (object) ユーザー入力パラメータ
status (string) 会話状態
introduction (string) 紹介
created_at (timestamp) 作成タイムスタンプ、例：1705395332
updated_at (timestamp) 更新タイムスタンプ、例：1705395332
リクエスト
POST
/conversations/:conversation_id/name
curl -X POST 'https://api.dify.ai/v1/conversations/:conversation_id/name' \
--header 'Authorization: Bearer {api_key}' \
--header 'Content-Type: application/json' \
--data-raw '{ 
 "name": "", 
 "auto_generate": true, 
 "user": "abc-123"
}'

Copy
Copied!
応答
{
    "id": "cd78daf6-f9e4-4463-9ff2-54257230a0ce",
    "name": "チャット vs AI",
    "inputs": {},
    "status": "normal",
    "introduction": "",
    "created_at": 1705569238,
    "updated_at": 1705569238
}

Copy
Copied!
GET
/conversations/:conversation_id/variables
会話変数の取得
特定の会話から変数を取得します。このエンドポイントは、会話中に取得された構造化データを抽出するのに役立ちます。

パスパラメータ
Name
conversation_id
Type
string
Description
変数を取得する会話のID。

クエリパラメータ
Name
user
Type
string
Description
ユーザー識別子。開発者によって定義されたルールに従い、アプリケーション内で一意である必要があります。

Name
last_id
Type
string
Description
(Optional)現在のページの最後の記録のID、デフォルトはnullです。

Name
limit
Type
int
Description
(Optional)1回のリクエストで返す記録の数、デフォルトは最新の20件です。最大100、最小1。

レスポンス
limit (int) ページごとのアイテム数
has_more (bool) さらにアイテムがあるかどうか
data (array[object]) 変数のリスト
id (string) 変数 ID
name (string) 変数名
value_type (string) 変数タイプ（文字列、数値、真偽値など）
value (string) 変数値
description (string) 変数の説明
created_at (int) 作成タイムスタンプ
updated_at (int) 最終更新タイムスタンプ
エラー
404, conversation_not_exists, 会話が見つかりません
Request
GET
/conversations/:conversation_id/variables
curl -X GET 'https://api.dify.ai/v1/conversations/{conversation_id}/variables?user=abc-123' \
--header 'Authorization: Bearer {api_key}'

Copy
Copied!
Request with variable name filter
curl -X GET '${props.appDetail.api_base_url}/conversations/{conversation_id}/variables?user=abc-123&variable_name=customer_name' \
--header 'Authorization: Bearer {api_key}'

Copy
Copied!
Response
{
  "limit": 100,
  "has_more": false,
  "data": [
    {
      "id": "variable-uuid-1",
      "name": "customer_name",
      "value_type": "string",
      "value": "John Doe",
      "description": "会話から抽出された顧客名",
      "created_at": 1650000000000,
      "updated_at": 1650000000000
    },
    {
      "id": "variable-uuid-2",
      "name": "order_details",
      "value_type": "json",
      "value": "{\"product\":\"Widget\",\"quantity\":5,\"price\":19.99}",
      "description": "顧客の注文詳細",
      "created_at": 1650000000000,
      "updated_at": 1650000000000
    }
  ]
}

Copy
Copied!
POST
/audio-to-text
音声からテキストへ
このエンドポイントは multipart/form-data リクエストを必要とします。

リクエストボディ
Name
file
Type
file
Description
オーディオファイル。 サポートされている形式：['mp3', 'mp4', 'mpeg', 'mpga', 'm4a', 'wav', 'webm'] ファイルサイズ制限：15MB

Name
user
Type
string
Description
ユーザー識別子、開発者のルールによって定義され、アプリケーション内で一意でなければなりません。

応答
text (string) 出力テキスト
リクエスト
POST
/audio-to-text
curl -X POST 'https://api.dify.ai/v1/audio-to-text' \
--header 'Authorization: Bearer {api_key}' \
--form 'file=@localfile;type=audio/[mp3|mp4|mpeg|mpga|m4a|wav|webm]'

Copy
Copied!
応答
{
  "text": ""
}

Copy
Copied!
POST
/text-to-audio
テキストから音声へ
テキストを音声に変換します。

リクエストボディ
Name
message_id
Type
str
Description
Difyによって生成されたテキストメッセージの場合、生成されたメッセージIDを直接渡します。バックエンドはメッセージIDを使用して対応する内容を検索し、音声情報を直接合成します。message_idとtextが同時に提供される場合、message_idが優先されます。

Name
text
Type
str
Description
音声生成コンテンツ。

Name
user
Type
string
Description
ユーザー識別子、開発者によって定義され、アプリ内で一意であることを保証しなければなりません。

リクエスト
POST
/text-to-audio
curl -o text-to-audio.mp3 -X POST 'https://api.dify.ai/v1/text-to-audio' \
--header 'Authorization: Bearer {api_key}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "message_id": "5ad4cb98-f0c7-4085-b384-88c403be6290",
    "text": "Hello Dify",
    "user": "abc-123"
}'

Copy
Copied!
ヘッダー
{
  "Content-Type": "audio/wav"
}

Copy
Copied!
GET
/info
アプリケーションの基本情報を取得
このアプリケーションの基本情報を取得するために使用されます

Response
name (string) アプリケーションの名前
description (string) アプリケーションの説明
tags (array[string]) アプリケーションのタグ
mode (string) アプリケーションのモード
author_name (string) 作者の名前
Request
GET
/info
curl -X GET 'https://api.dify.ai/v1/info' \
-H 'Authorization: Bearer {api_key}'

Copy
Copied!
Response
{
  "name": "My App",
  "description": "This is my app.",
  "tags": [
    "tag1",
    "tag2"
  ],
  "mode": "advanced-chat",
  "author_name": "Dify"
}

Copy
Copied!
GET
/parameters
アプリケーションのパラメータ情報を取得
ページに入る際に、機能、入力パラメータ名、タイプ、デフォルト値などの情報を取得するために使用されます。

応答
opening_statement (string) 開始の挨拶
suggested_questions (array[string]) 開始時の推奨質問のリスト
suggested_questions_after_answer (object) 答えを有効にした後の質問を提案します。
enabled (bool) 有効かどうか
speech_to_text (object) 音声からテキストへ
enabled (bool) 有効かどうか
text_to_speech (object) テキストから音声へ
enabled (bool) 有効かどうか
voice (string) 音声タイプ
language (string) 言語
autoPlay (string) 自動再生
enabled 有効
disabled 無効
retriever_resource (object) 引用と帰属
enabled (bool) 有効かどうか
annotation_reply (object) 注釈返信
enabled (bool) 有効かどうか
user_input_form (array[object]) ユーザー入力フォームの設定
text-input (object) テキスト入力コントロール
label (string) 変数表示ラベル名
variable (string) 変数ID
required (bool) 必須かどうか
default (string) デフォルト値
paragraph (object) 段落テキスト入力コントロール
label (string) 変数表示ラベル名
variable (string) 変数ID
required (bool) 必須かどうか
default (string) デフォルト値
select (object) ドロップダウンコントロール
label (string) 変数表示ラベル名
variable (string) 変数ID
required (bool) 必須かどうか
default (string) デフォルト値
options (array[string]) オプション値
file_upload (object) ファイルアップロード設定
document (object) ドキュメント設定
現在サポートされているドキュメントタイプ：txt, md, markdown, pdf, html, xlsx, xls, docx, csv, eml, msg, pptx, ppt, xml, epub。
enabled (bool) 有効かどうか
number_limits (int) ドキュメント数の上限。デフォルトは 3
transfer_methods (array[string]) 転送方法リスト：remote_url, local_file。いずれかを選択する必要があります。
image (object) 画像設定
現在サポートされている画像タイプ：png, jpg, jpeg, webp, gif。
enabled (bool) 有効かどうか
number_limits (int) 画像数の上限。デフォルトは 3
transfer_methods (array[string]) 転送方法リスト：remote_url, local_file。いずれかを選択する必要があります。
audio (object) オーディオ設定
現在サポートされているオーディオタイプ：mp3, m4a, wav, webm, amr。
enabled (bool) 有効かどうか
number_limits (int) オーディオ数の上限。デフォルトは 3
transfer_methods (array[string]) 転送方法リスト：remote_url, local_file。いずれかを選択する必要があります。
video (object) ビデオ設定
現在サポートされているビデオタイプ：mp4, mov, mpeg, mpga。
enabled (bool) 有効かどうか
number_limits (int) ビデオ数の上限。デフォルトは 3
transfer_methods (array[string]) 転送方法リスト：remote_url, local_file。いずれかを選択する必要があります。
custom (object) カスタム設定
enabled (bool) 有効かどうか
number_limits (int) カスタム数の上限。デフォルトは 3
transfer_methods (array[string]) 転送方法リスト：remote_url, local_file。いずれかを選択する必要があります。
system_parameters (object) システムパラメータ
file_size_limit (int) ドキュメントアップロードサイズ制限（MB）
image_file_size_limit (int) 画像ファイルアップロードサイズ制限（MB）
audio_file_size_limit (int) オーディオファイルアップロードサイズ制限（MB）
video_file_size_limit (int) ビデオファイルアップロードサイズ制限（MB）
リクエスト
GET
/parameters
 curl -X GET 'https://api.dify.ai/v1/parameters'

Copy
Copied!
応答
{
  "opening_statement": "こんにちは！",
  "suggested_questions_after_answer": {
      "enabled": true
  },
  "speech_to_text": {
      "enabled": true
  },
  "text_to_speech": {
      "enabled": true,
      "voice": "sambert-zhinan-v1",
      "language": "zh-Hans",
      "autoPlay": "disabled"
  },
  "retriever_resource": {
      "enabled": true
  },
  "annotation_reply": {
      "enabled": true
  },
  "user_input_form": [
      {
          "paragraph": {
              "label": "クエリ",
              "variable": "query",
              "required": true,
              "default": ""
          }
      }
  ],
  "file_upload": {
      "image": {
          "enabled": false,
          "number_limits": 3,
          "detail": "high",
          "transfer_methods": [
              "remote_url",
              "local_file"
          ]
      }
  },
  "system_parameters": {
      "file_size_limit": 15,
      "image_file_size_limit": 10,
      "audio_file_size_limit": 50,
      "video_file_size_limit": 100
  }
}

Copy
Copied!
GET
/meta
アプリケーションのメタ情報を取得
このアプリケーションのツールのアイコンを取得するために使用されます

応答
tool_icons(object[string]) ツールアイコン
tool_name (string)
icon (object|string)
(object) アイコンオブジェクト
background (string) 背景色（16 進数形式）
content(string) 絵文字
(string) アイコンの URL
リクエスト
GET
/meta
curl -X GET 'https://api.dify.ai/v1/meta' \
-H 'Authorization: Bearer {api_key}'

Copy
Copied!
応答
{
  "tool_icons": {
    "dalle2": "https://cloud.dify.ai/console/api/workspaces/current/tool-provider/builtin/dalle/icon",
    "api_tool": {
      "background": "#252525",
      "content": "😁"
    }
  }
}

Copy
Copied!
GET
/site
アプリのWebApp設定を取得
アプリの WebApp 設定を取得するために使用します。

応答
title (string) WebApp 名
chat_color_theme (string) チャットの色テーマ、16 進数形式
chat_color_theme_inverted (bool) チャットの色テーマを反転するかどうか
icon_type (string) アイコンタイプ、emoji-絵文字、image-画像
icon (string) アイコン。emojiタイプの場合は絵文字、imageタイプの場合は画像 URL
icon_background (string) 16 進数形式の背景色
icon_url (string) アイコンの URL
description (string) 説明
copyright (string) 著作権情報
privacy_policy (string) プライバシーポリシーのリンク
custom_disclaimer (string) カスタム免責事項
default_language (string) デフォルト言語
show_workflow_steps (bool) ワークフローの詳細を表示するかどうか
use_icon_as_answer_icon (bool) WebApp のアイコンをチャット内の🤖に置き換えるかどうか
Request
POST
/meta
curl -X GET 'https://api.dify.ai/v1/site' \
-H 'Authorization: Bearer {api_key}'

Copy
Copied!
Response
{
  "title": "My App",
  "chat_color_theme": "#ff4a4a",
  "chat_color_theme_inverted": false,
  "icon_type": "emoji",
  "icon": "😄",
  "icon_background": "#FFEAD5",
  "icon_url": null,
  "description": "This is my app.",
  "copyright": "all rights reserved",
  "privacy_policy": "",
  "custom_disclaimer": "All generated by AI",
  "default_language": "en-US",
  "show_workflow_steps": false,
  "use_icon_as_answer_icon": false,
}

