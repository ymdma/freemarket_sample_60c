class CreditCardsController < ApplicationController


  require "payjp"
  before_action :set_card

  def new
    card = CreditCard.where(user_id: current_user.id).first
    if card.present?
      redirect_to action: "index"
    end
  end

  def pay #payjpとCardのデータベース作成を実施します。
    Payjp.api_key = 'sk_test_f98999ddca480c61d3498ee7'    # ここでテスト鍵をセットしてあげる(環境変数にしても良い)
    if params['payjp-token'].blank?    # paramsの中にjsで作った'payjpTokenが存在するか確かめる
    redirect_to action: "new"
    else
    customer = Payjp::Customer.create(
    # description: '登録テスト', #なくてもOK
    # email: current_user.email, #なくてもOK
    card: params['payjp-token'],
    metadata: {user_id: current_user.id} #なくてもOK
    )
    @card = CreditCard.new(user_id: current_user.id, customer_id: customer.id, card_id: customer.default_card)
      if @card.save
        redirect_to action: "show"
      else
        redirect_to action: "pay"
      end
    end
  end

  def delete #PayjpとCardデータベースを削除します
    card = CreditCard.where(user_id: current_user.id).first
    if card.blank?
    else
      Payjp.api_key = 'sk_test_f98999ddca480c61d3498ee7'
      customer = Payjp::Customer.retrieve(card.customer_id)
      customer.delete
      card.delete
    end
      redirect_to action: "new"

  end



  def show #Cardのデータpayjpに送り情報を取り出します
    card = CreditCard.where(user_id: current_user.id).first
    if card.blank?
      # redirect_to action: "new"
    else
      Payjp.api_key = 'sk_test_f98999ddca480c61d3498ee7'
      customer = Payjp::Customer.retrieve(card.customer_id)
      @default_card_information = customer.cards.retrieve(card.card_id)
    end
    # binding.pry
  end

  private

  def set_card
    @card = CreditCard.where(user_id: current_user.id)
  end


end